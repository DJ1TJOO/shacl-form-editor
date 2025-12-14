<script setup lang="ts">
import { PrefixInput } from '@/components/form-ui/prefix'
import { injectPropertiesListContext } from '@/components/properties/list/list.vue'
import {
  addExistingPropertiesAtTarget,
  addNewPropertiesAtTarget,
  createOrderingGapAtTarget,
  createOrderingGapForExisting,
  getDraggingExistingProperties,
  getDraggingNewProperties,
  getMaxOrder,
  getTargetOrder,
  moveProperty,
  recalculateOrdersForGroup,
  recalculateOrdersForShape,
  type DraggingExistingProperties,
  type DraggingExistingPropertiesInGroup,
  type DraggingExistingPropertiesNotInGroup,
  type PropertiesList,
} from '@/components/properties/list/ordering'
import { RDFS, Shacl, Xsd } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useFileStore, useGlobalName, useLiteralList } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { useDraggable, useDroppable } from '@vue-dnd-kit/core'
import { ChevronDownIcon, GripVerticalIcon, InfoIcon, UngroupIcon, XIcon } from 'lucide-vue-next'
import { BlankNode, Literal, NamedNode } from 'rdflib'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed, nextTick, ref, watch } from 'vue'
import { AddButton, RemoveButton } from '../../form-ui/buttons'
import { LanguageSelect } from '../../form-ui/languages'
import { Textarea } from '../../ui/textarea'

const { subject, order, properties } = defineProps<{
  subject: NamedNode
  order: number
  properties: PropertiesList
}>()

const store = useFileStore()
const { value: iri, node: iriNode } = useGlobalName({ initialValue: subject.value })
const name = computed(() => Shacl.getLocalName(iri.value))
const optionsTitle = computed(() => 'Options for ' + name.value)
const { items: labels } = useLiteralList({ subject: iriNode, predicate: RDFS('label') })
const { items: descriptions } = useLiteralList({ subject: iriNode, predicate: RDFS('comment') })

const {
  target,
  Define: DefineOptions,
  isOpen: isOpenOptions,
} = useOptionsSidebar(Symbol('group-options-' + encodeURIComponent(subject.value)), optionsTitle, {
  allowGrouping: false,
})

const isOpen = ref(true)
const { listOpen, indeterminate } = injectPropertiesListContext()
watch(listOpen, (newVal) => {
  if (newVal === 'indeterminate') return
  isOpen.value = newVal
})
watch(isOpen, (newVal) => {
  if (newVal === listOpen.value) return
  indeterminate()
})

const groupId = computed(() => {
  if (!iri.value) return undefined
  return `group-${encodeURIComponent(iri.value)}`
})
const { elementRef: draggableRef, handleDragStart } = useDraggable({
  id: groupId.value,
  data: computed<DraggingExistingProperties>(() => ({
    subject,
    order,
    groupOrder: undefined,
  })),
  containerProps: {
    class: '',
  },
})

async function handleMoveProperty(offset: number) {
  moveProperty(store.value, subject, offset)
  await nextTick()

  if (!groupId.value) return
  const groupElement = document.getElementById(groupId.value)
  const button = groupElement?.querySelector('button[data-grip-button]') as HTMLButtonElement
  button?.focus()
}

const handleUngroup = () => {
  store.value.removeMatches(subject, null, null)

  const properties = store.value.each(null, Shacl.SHACL('group'), subject) as (
    | BlankNode
    | NamedNode
  )[]
  store.value.removeMatches(null, Shacl.SHACL('group'), subject)

  const shapes = new Set<string>()
  for (const property of properties) {
    store.value.removeMatches(property, Shacl.SHACL('order'))
    if (typeof order === 'number') {
      store.value.add(property, Shacl.SHACL('order'), Literal.fromValue<Literal>(order))
    }

    const shape = store.value.any(null, Shacl.SHACL('property'), property)
    if (!shape || !(shape instanceof NamedNode)) continue
    shapes.add(shape.value)
  }

  for (const shape of shapes) {
    recalculateOrdersForShape(store.value, new NamedNode(shape))
  }
}

const { elementRef: dropzoneRef } = useDroppable({
  events: {
    onDrop: (dropStore) => {
      const targetOrder = getTargetOrder(dropStore)
      const newProperties = getDraggingNewProperties(dropStore)

      // Adding new properties
      if (newProperties.length > 0) {
        console.log(targetOrder)

        if (typeof targetOrder !== 'undefined') {
          createOrderingGapAtTarget(store.value, properties, targetOrder, newProperties.length)
          addNewPropertiesAtTarget(targetOrder, newProperties, iriNode.value)
        } else {
          const maxOrder = getMaxOrder(properties)

          addNewPropertiesAtTarget(maxOrder + 1, newProperties, iriNode.value)
        }

        return
      }

      // Moving existing properties
      if (typeof targetOrder !== 'undefined') {
        const draggingElements = getDraggingExistingProperties(dropStore)
        if (draggingElements.length === 0) return

        const allInGroup = draggingElements.every(
          (el): el is DraggingExistingPropertiesInGroup =>
            typeof el.groupOrder !== 'undefined' && typeof el.groupSubject !== 'undefined',
        )
        const allNotInGroup = draggingElements.every(
          (el): el is DraggingExistingPropertiesNotInGroup =>
            typeof el.groupOrder === 'undefined' || typeof el.groupSubject === 'undefined',
        )

        if (!allInGroup && !allNotInGroup) {
          throw new Error('Unsupported dragging: Dragging elements must all be in a group or not')
        }

        const shapes = allNotInGroup
          ? draggingElements.flatMap((el) =>
              store.value.each(null, Shacl.SHACL('property'), el.subject),
            )
          : []

        const draggingOrders = draggingElements.map((el) => el.order)
        const minDraggingOrder = Math.min(...draggingOrders)
        const numDragging = draggingElements.length
        const isMovingDown = minDraggingOrder < targetOrder

        createOrderingGapForExisting(store.value, properties, draggingElements, targetOrder)

        const targetOrderWithOffset = isMovingDown ? targetOrder - numDragging + 1 : targetOrder
        addExistingPropertiesAtTarget(
          store.value,
          targetOrderWithOffset,
          draggingElements,
          iriNode.value,
        )

        if (allInGroup) {
          for (const { groupSubject } of draggingElements) {
            recalculateOrdersForGroup(store.value, groupSubject)
          }
        } else if (shapes.length > 0) {
          for (const shape of shapes) {
            if (!(shape instanceof NamedNode)) continue
            recalculateOrdersForShape(store.value, shape)
          }
        }
      }
    },
  },
})
</script>

<template>
  <DefineOptions>
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel>
            IRI
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <PrefixInput v-model="iri" placeholder="ex:MyGroup" />
        </Field>
        <Field class="gap-0.5 grid grid-cols-[1fr_--spacing(20)]">
          <div class="grid grid-cols-subgrid col-span-2">
            <FieldLabel>
              Label
              <Tooltip>
                <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
                <TooltipContent>This is content in a tooltip.</TooltipContent>
              </Tooltip>
            </FieldLabel>
            <FieldLabel v-if="labels.length > 0"> Language </FieldLabel>
          </div>
          <div
            class="grid grid-cols-subgrid col-span-2"
            v-for="(label, index) in labels"
            :key="index"
          >
            <InputGroup>
              <InputGroupInput v-model="label.value" placeholder="My group" />
              <InputGroupAddon align="inline-end">
                <RemoveButton @click="labels.splice(index, 1)" />
              </InputGroupAddon>
            </InputGroup>
            <!-- @TODO: show we show error when the same language is used for multiple times -->
            <LanguageSelect v-model="label.language" />
          </div>
          <AddButton
            @click="
              labels.push({
                value: '',
                language: undefined,
                node: new Literal(''),
                datatype: Xsd.string,
              })
            "
          />
        </Field>
        <Field>
          <FieldLabel>
            Description
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <div
            v-for="(description, index) in descriptions"
            :key="index"
            class="space-y-0.5 has-[+div]:mb-2"
          >
            <Textarea
              v-model="description.value"
              placeholder="This is a group with a description"
            />
            <div class="flex items-center gap-0.5">
              <div class="flex-1">
                <LanguageSelect v-model="description.language" />
              </div>
              <RemoveButton standalone @click="descriptions.splice(index, 1)" />
            </div>
          </div>
          <AddButton
            @click="
              descriptions.push({
                value: '',
                language: undefined,
                node: new Literal(''),
                datatype: Xsd.string,
              })
            "
          />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button class="w-full" color="danger" @click="handleUngroup">
      <UngroupIcon />
      Ungroup
    </Button>
  </DefineOptions>
  <li ref="draggableRef" class="list-none">
    <CollapsibleRoot
      ref="target"
      :class="
        cn(
          'mx-auto p-2 border-2 border-separator rounded-lg max-w-[calc(var(--container-md)+1rem+4px)]',
          isOpenOptions && 'outline-solid outline-2 outline-complementary -outline-offset-2',
        )
      "
      v-model:open="isOpen"
      :unmountOnHide="false"
      :id="groupId"
      :data-subject="iri"
    >
      <div class="flex justify-between items-center gap-2 px-2">
        <Button
          variant="ghost"
          size="icon"
          data-grip-button
          @pointerdown="handleDragStart"
          @keydown.up.left.stop.prevent="() => handleMoveProperty(-1)"
          @keydown.down.right.stop.prevent="() => handleMoveProperty(1)"
        >
          <GripVerticalIcon />
        </Button>

        <CollapsibleTrigger as-child class="group/property-collapsible-trigger">
          <h2
            class="flex justify-center justify-self-center items-center gap-1 w-fit font-bold text-branding"
          >
            {{ name }}
            <Button variant="ghost" size="icon">
              <ChevronDownIcon
                class="group-data-[state=open]/property-collapsible-trigger:-rotate-180 transition-transform"
              />
            </Button>
          </h2>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon"
          color="danger"
          class="justify-self-end"
          @click="handleUngroup"
        >
          <XIcon />
        </Button>
      </div>
      <CollapsibleContent>
        <ul ref="dropzoneRef" class="space-y-2 mt-1">
          <slot />
        </ul>
      </CollapsibleContent>
    </CollapsibleRoot>
  </li>
</template>
