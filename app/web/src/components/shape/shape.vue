<script setup lang="ts">
import { AdditionalConstraints } from '@/components/constraints'
import { SelectLanguage, Shacl } from '@/components/rdf'
import { RDF } from '@/components/rdf/shacl'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useLiteral, useNamedNode } from '@/composables/use-rdf'
import { cn } from '@/lib/cn'
import { useDebounceFn } from '@vueuse/core'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon, TypeIcon } from 'lucide-vue-next'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const route = useRoute()
const router = useRouter()

const shapeIRI = computed(() =>
  typeof route.params.shapeId === 'string' ? decodeURIComponent(route.params.shapeId) : undefined,
)

const { value: iri, namedNode: node } = useNamedNode({ initialValue: shapeIRI })
const { value: type } = useNamedNode({ subject: node, predicate: RDF('type') })

const updateRoute = useDebounceFn((iri: string | undefined) => {
  if (!iri) return

  const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
  router.replace(`/file/${fileId}/${encodeURIComponent(iri)}`)
}, 500)

watch(iri, (iri) => {
  updateRoute(iri)
})

const {
  target,
  Define: DefineOptions,
  open: openOptions,
  isOpen,
} = useOptionsSidebar(Symbol('shape-options'), 'Options for MyNode', { allowGrouping: false })

const { value: label, language: labelLanguage } = useLiteral({
  subject: node,
  predicate: Shacl.SHACL('name'),
})
const { value: description, language: descriptionLanguage } = useLiteral({
  subject: node,
  predicate: Shacl.SHACL('description'),
})
const { value: path } = useNamedNode({ subject: node, predicate: Shacl.SHACL('path') })
</script>

<template>
  <DefineOptions>
    <AdditionalConstraints />
  </DefineOptions>
  <div
    ref="target"
    :class="
      cn(
        'bg-background p-2 rounded-lg',
        isOpen && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
  >
    <FieldSet v-if="open">
      <FieldLegend
        v-if="type === Shacl.SHACL('PropertyShape').value"
        class="justify-center w-full font-normal text-text"
      >
        <TypeIcon />
        Text field
      </FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>
            IRI
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input v-model="iri" placeholder="ex:MyNode" />
        </Field>
        <Field v-if="type === Shacl.SHACL('PropertyShape').value">
          <FieldLabel>
            Path
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input v-model="path" placeholder="ex:path" />
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
            <FieldLabel> Language </FieldLabel>
          </div>
          <div class="grid grid-cols-subgrid col-span-2">
            <Input v-model="label" placeholder="My Node" />
            <SelectLanguage v-model="labelLanguage" />
          </div>
        </Field>
        <Field>
          <FieldLabel>
            Description
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Textarea v-model="description" placeholder="This is a node with a description" />

          <FieldLabel>Description Language </FieldLabel>
          <SelectLanguage v-model="descriptionLanguage" />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button v-if="open" color="background-blue" class="mt-2 w-full" @click="openOptions">
      <PanelRightOpenIcon /> Additional options
    </Button>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="type === Shacl.SHACL('NodeShape').value ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
