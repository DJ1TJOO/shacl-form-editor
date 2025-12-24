<script setup lang="ts">
import { useFile } from '@/components/file'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { properties, type PropertiesDefinition } from '@/components/properties'
import { RDF_CLASS_TYPES } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useShapes } from '@/composables/use-shacl'
import { reactiveOmit } from '@vueuse/core'
import { CircleIcon, DiamondIcon, InfoIcon } from 'lucide-vue-next'
import {
  RovingFocusGroup,
  RovingFocusItem,
  useForwardPropsEmits,
  type DialogRootEmits,
  type DialogRootProps,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')

const forward = useForwardPropsEmits(delegatedProps, emits)

const { addNodeShape, addPropertyShape } = useShapes()
const { fileId } = useFile()

const router = useRouter()
const type = ref<'node' | 'property'>('node')
const iri = ref('')

const property = ref<PropertiesDefinition | undefined>(undefined)

const targetClass = ref<{ value: string }[]>([])
const targetNode = ref<{ value: string }[]>([])
const targetSubjectsOf = ref<{ value: string }[]>([])
const targetObjectsOf = ref<{ value: string }[]>([])

const open = defineModel<boolean>('open')
if (props.defaultOpen) {
  open.value = true
}

function close() {
  open.value = false
}

function reset() {
  type.value = 'node'
  iri.value = ''
  resetTargets()
}

function switchType(newType: 'node' | 'property') {
  if (type.value === newType) return
  type.value = newType
  resetTargets()
}

function resetTargets() {
  targetClass.value = []
  targetNode.value = []
  targetSubjectsOf.value = []
  targetObjectsOf.value = []
}

const valid = computed(() => {
  if (iri.value.trim().length < 1 || !iri.value.includes(':')) return false

  for (const target of targetClass.value) {
    if (target.value.trim().length < 1 || !target.value.includes(':')) return false
  }
  for (const target of targetNode.value) {
    if (target.value.trim().length < 1 || !target.value.includes(':')) return false
  }
  for (const target of targetSubjectsOf.value) {
    if (target.value.trim().length < 1 || !target.value.includes(':')) return false
  }
  for (const target of targetObjectsOf.value) {
    if (target.value.trim().length < 1 || !target.value.includes(':')) return false
  }

  if (type.value === 'property' && !property.value) return false

  return true
})

function create() {
  if (!valid.value) return

  const shapeIRI = iri.value.trim()
  if (type.value === 'node') {
    addNodeShape({
      iri: shapeIRI,
      targetClass: targetClass.value.map((classEntry) => classEntry.value),
      targetNode: targetNode.value.map((nodeEntry) => nodeEntry.value),
      targetSubjectsOf: targetSubjectsOf.value.map((subjectEntry) => subjectEntry.value),
      targetObjectsOf: targetObjectsOf.value.map((objectEntry) => objectEntry.value),
    })
  } else {
    if (!property.value || !property.value.editor || !property.value.viewer) return

    addPropertyShape({
      iri: shapeIRI,
      editor: property.value.editor,
      viewer: property.value.viewer,
      datatype: property.value.datatype,
      nodeKind: property.value.nodeKind,
    })
  }

  router.push(`/file/${fileId.value}/${encodeURIComponent(shapeIRI)}`)
  reset()
  close()
}
</script>
<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogTrigger class="shrink-0" v-if="$slots.default">
      <slot />
    </DialogTrigger>
    <DialogScrollContent :aria-describedby="undefined">
      <form @submit.prevent="create" class="gap-4 grid">
        <DialogHeader>
          <DialogTitle>New shape</DialogTitle>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Type
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>Create a new node or property.</TooltipContent>
                </Tooltip>
              </FieldLabel>

              <RovingFocusGroup class="gap-2 grid grid-cols-2">
                <RovingFocusItem as-child>
                  <Button
                    type="button"
                    :color="type === 'node' ? 'default' : 'background-highlighted'"
                    @click="switchType('node')"
                    @focus="switchType('node')"
                  >
                    <DiamondIcon /> Node
                  </Button>
                </RovingFocusItem>
                <RovingFocusItem as-child>
                  <Button
                    type="button"
                    :color="type === 'property' ? 'default' : 'background-highlighted'"
                    @click="switchType('property')"
                    @focus="switchType('property')"
                  >
                    <CircleIcon /> Property
                  </Button>
                </RovingFocusItem>
              </RovingFocusGroup>
            </Field>

            <Field>
              <FieldLabel>
                Shape IRI
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>The IRI of the node or property.</TooltipContent>
                </Tooltip>
              </FieldLabel>
              <PrefixInput v-model="iri" placeholder="ex:MyNode" no-suggestions />
            </Field>

            <Field v-if="type === 'node'">
              <FieldLabel>
                Target class
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>
                    All instances of the given class are targeted by this shape.
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>

              <FieldList
                v-slot="{ entry, remove }"
                v-model="targetClass"
                :create="() => ({ value: '' })"
              >
                <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
                  <RemoveButton @click="remove" />
                </PrefixInput>
              </FieldList>
            </Field>

            <Field v-if="type === 'node'">
              <FieldLabel>
                Target node
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>The specific node that is targeted by this shape.</TooltipContent>
                </Tooltip>
              </FieldLabel>

              <FieldList
                v-slot="{ entry, remove }"
                v-model="targetNode"
                :create="() => ({ value: '' })"
              >
                <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
                  <RemoveButton @click="remove" />
                </PrefixInput>
              </FieldList>
            </Field>

            <Field v-if="type === 'node'">
              <FieldLabel>
                Target subjects of
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>
                    All subjects of triples with the given predicate are targeted by this shape.
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>

              <FieldList
                v-slot="{ entry, remove }"
                v-model="targetSubjectsOf"
                :create="() => ({ value: '' })"
              >
                <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
                  <RemoveButton @click="remove" />
                </PrefixInput>
              </FieldList>
            </Field>

            <Field v-if="type === 'node'">
              <FieldLabel>
                Target objects of
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>
                    All objects of triples with the given predicate are targeted by this shape.
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>

              <FieldList
                v-slot="{ entry, remove }"
                v-model="targetObjectsOf"
                :create="() => ({ value: '' })"
              >
                <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
                  <RemoveButton @click="remove" />
                </PrefixInput>
              </FieldList>
            </Field>

            <Field v-if="type === 'property'">
              <FieldLabel> Editor </FieldLabel>
              <Select v-model="property">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a editor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="property in properties.filter((property) => !property.noPropertyShape)"
                    :key="property.label"
                    :value="property"
                  >
                    <component :is="property.icon" />
                    {{ property.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <Button type="button" variant="ghost" @click="close">Close</Button>
          <Button type="submit" :disabled="!valid">Create</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
