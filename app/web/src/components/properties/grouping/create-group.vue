<script setup lang="ts">
import { useFileStore } from '@/components/file'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList } from '@/components/form-ui/field'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { injectOptionsSidebarProviderContext } from '@/components/options-bar'
import {
  createOrderingGapAtTarget,
  recalculateOrdersForShape,
} from '@/components/properties/list/ordering'
import { RDF, RDFS, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ADDED_TO_GROUP_EVENT,
  DEACTIVATE_GROUPED_EVENT,
  REMOVED_FROM_GROUP_EVENT,
} from '@/composables/use-active'
import { createReusableTemplate } from '@vueuse/core'
import { GroupIcon, InfoIcon } from 'lucide-vue-next'
import { BlankNode, Literal, NamedNode, Node } from 'rdflib'
import { computed, onMounted, ref, watch } from 'vue'

const id = Symbol('create-group')

const optionsSidebar = injectOptionsSidebarProviderContext()
const [Define, Reuse] = createReusableTemplate()

const store = useFileStore()

const properties = ref<
  {
    subject: string
    localName: string | undefined
    activatedAt: number
  }[]
>([])

const propertyLabels = computed(() => properties.value.map(({ localName }) => localName))

function open() {
  optionsSidebar.open(id, propertyLabels.value.join(', '), Reuse)
}

watch(optionsSidebar.currentId, (newId, oldId) => {
  if (newId !== undefined || oldId !== id) return
  window.dispatchEvent(new CustomEvent(DEACTIVATE_GROUPED_EVENT))
})

onMounted(() => {
  window.addEventListener(ADDED_TO_GROUP_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return

    const target = event.detail.target as HTMLElement | SVGElement | null | undefined
    const activatedAt = event.detail.activatedAt as number | undefined
    const subject = target?.getAttribute('data-subject') as string | undefined
    const localName = target?.getAttribute('data-local-name') as string | undefined
    if (!subject || typeof activatedAt !== 'number') return

    properties.value.push({ subject, localName, activatedAt })
    properties.value.sort((a, b) => a.activatedAt - b.activatedAt)

    open()
  })
  window.addEventListener(REMOVED_FROM_GROUP_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return

    const target = event.detail.target as HTMLElement | SVGElement | null | undefined
    const removedSubject = target?.getAttribute('data-subject') as string | undefined
    if (!removedSubject) return

    properties.value = properties.value.filter(({ subject }) => subject !== removedSubject)
    if (properties.value.length === 0) {
      optionsSidebar.close(id)
    } else {
      open()
    }
  })
})

const iri = ref<string>('')
const labels = ref<{ value: string; language?: string }[]>([])
const descriptions = ref<{ value: string; language?: string }[]>([])

const valid = computed(() => {
  return (
    iri.value.trim().length > 0 &&
    labels.value.length > 0 &&
    labels.value.every((label) => label.value.trim().length > 0)
  )
})

function handleCreate() {
  if (!valid.value) return

  const group = new NamedNode(iri.value)
  store.value.add(group, RDF('type'), Shacl.SHACL('PropertyGroup'))
  for (const label of labels.value) {
    store.value.add(group, RDFS('label'), new Literal(label.value, label.language))
  }
  for (const description of descriptions.value) {
    store.value.add(group, RDFS('comment'), new Literal(description.value, description.language))
  }

  const shapes = new Set<string>()
  let groupOrder: number | null = null
  for (const [index, propertyId] of properties.value.entries()) {
    const property = new BlankNode(propertyId.subject)

    if (groupOrder === null) {
      const order = store.value.any(property, Shacl.SHACL('order'))
      if (order instanceof Literal) {
        groupOrder = Node.toJS(order) as number
      }
    }

    store.value.removeMatches(property, Shacl.SHACL('group'))
    store.value.removeMatches(property, Shacl.SHACL('order'))

    store.value.add(property, Shacl.SHACL('group'), group)
    store.value.add(property, Shacl.SHACL('order'), Literal.fromValue<Literal>(index))

    const shape = store.value.any(null, Shacl.SHACL('property'), property)
    if (!shape || !(shape instanceof NamedNode)) continue
    shapes.add(shape.value)
  }

  const shape = Array.from(shapes)[0]
  if (shape && groupOrder !== null) {
    createOrderingGapAtTarget(
      store.value,
      Shacl.getNodeProperties(store.value, new NamedNode(shape)),
      groupOrder,
      1,
    )
  }

  store.value.removeMatches(group, Shacl.SHACL('order'))
  if (groupOrder !== undefined) {
    store.value.add(group, Shacl.SHACL('order'), Literal.fromValue<Literal>(groupOrder))
  }

  for (const shape of shapes) {
    recalculateOrdersForShape(store.value, new NamedNode(shape))
  }

  iri.value = ''
  labels.value = []
  descriptions.value = []

  optionsSidebar.close(id)
}
</script>

<template>
  <Define class="space-y-4">
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel>
            IRI
            <Tooltip>
              <TooltipTrigger><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <PrefixInput v-model="iri" placeholder="ex:MyGroup" no-suggestions />
        </Field>
        <Field class="gap-0.5 grid grid-cols-[1fr_--spacing(20)]">
          <div class="grid grid-cols-subgrid col-span-2">
            <FieldLabel>
              Label
              <Tooltip>
                <TooltipTrigger><InfoIcon /></TooltipTrigger>
                <TooltipContent>This is content in a tooltip.</TooltipContent>
              </Tooltip>
            </FieldLabel>
            <FieldLabel v-if="labels.length > 0"> Language </FieldLabel>
          </div>
          <FieldList
            v-slot="{ entry, remove }"
            v-model="labels"
            :create="() => ({ value: '', language: undefined })"
            list-class="grid grid-cols-subgrid col-span-2"
            class="grid grid-cols-subgrid col-span-2"
          >
            <InputGroup>
              <InputGroupInput v-model="entry.value" placeholder="My group" />
              <InputGroupAddon align="inline-end">
                <RemoveButton @click="remove" />
              </InputGroupAddon>
            </InputGroup>
            <!-- @TODO: show we show error when the same language is used for multiple times -->
            <LanguageSelect v-model="entry.language" />
          </FieldList>
        </Field>
        <Field>
          <FieldLabel>
            Description
            <Tooltip>
              <TooltipTrigger><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <FieldList
            v-slot="{ entry, remove }"
            v-model="descriptions"
            :create="() => ({ value: '', language: undefined })"
            focus-element="textarea"
            class="space-y-0.5 has-[+div]:mb-2"
          >
            <Textarea v-model="entry.value" placeholder="This is a group with a description" />
            <div class="flex items-center gap-0.5">
              <div class="flex-1">
                <LanguageSelect v-model="entry.language" />
              </div>
              <RemoveButton standalone @click="remove" />
            </div>
          </FieldList>
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button class="w-full" :disabled="!valid" @click="handleCreate">
      <GroupIcon />
      Create group
    </Button>
  </Define>
</template>
