<script setup lang="ts">
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
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
import { useFileStore } from '@/composables/use-shacl'
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
    id: string
    subject: string
    activatedAt: number
  }[]
>([])

const propertyLabels = computed(() =>
  properties.value.map(({ id }) => {
    const path = decodeURIComponent(id.split('-').pop() ?? '')
    return path ? Shacl.getLocalName(path) : ''
  }),
)

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

    const id = event.detail.id as string
    const activatedAt = event.detail.activatedAt as number | undefined
    const subject = document.getElementById(id)?.getAttribute('data-subject') as string | undefined
    if (!subject || typeof activatedAt !== 'number') return

    properties.value.push({ id, subject, activatedAt })
    properties.value.sort((a, b) => a.activatedAt - b.activatedAt)

    open()
  })
  window.addEventListener(REMOVED_FROM_GROUP_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return

    properties.value = properties.value.filter(({ id }) => id !== event.detail.id)
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

  console.log(groupOrder)

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
              })
            "
          />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button class="w-full" :disabled="!valid" @click="handleCreate">
      <GroupIcon />
      Create group
    </Button>
  </Define>
</template>
