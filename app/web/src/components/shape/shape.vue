<script setup lang="ts">
import { AdditionalConstraints } from '@/components/constraints'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { injectFileContext, RDF, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useLiteral, useNamed, useNamedList } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon, TypeIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const { currentShape } = injectFileContext()
const types = useNamedList({ subject: currentShape.namedNode, predicate: RDF('type') })
const type = computed(() => {
  if (types.some((type) => type.value === Shacl.SHACL('NodeShape').value)) return 'node'
  if (types.some((type) => type.value === Shacl.SHACL('PropertyShape').value)) return 'property'
  return undefined
})

const iri = ref<string | undefined>(currentShape.value.value)
watch(
  () => currentShape.value.value,
  (newVal) => {
    iri.value = newVal
  },
  { immediate: true },
)

const {
  target,
  Define: DefineOptions,
  open: openOptions,
  isOpen,
} = useOptionsSidebar(
  Symbol(
    `shape-options-${currentShape.namedNode.value ? Shacl.getLocalName(currentShape.namedNode.value) : ''}`,
  ),
  `Options for ${currentShape.namedNode.value ? Shacl.getLocalName(currentShape.namedNode.value) : ''}`,
  { allowGrouping: false },
)

const { value: label, language: labelLanguage } = useLiteral({
  subject: currentShape.namedNode,
  predicate: Shacl.SHACL('name'),
})
const { value: description, language: descriptionLanguage } = useLiteral({
  subject: currentShape.namedNode,
  predicate: Shacl.SHACL('description'),
})
const { value: path } = useNamed({
  subject: currentShape.namedNode,
  predicate: Shacl.SHACL('path'),
})
</script>

<template>
  <DefineOptions>
    <AdditionalConstraints v-if="type" :type="type" :subject="currentShape.namedNode.value" />
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
      <FieldLegend v-if="type === 'property'" class="justify-center w-full font-normal text-text">
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
          <PrefixInput
            v-if="iri"
            v-model="iri"
            placeholder="ex:MyNode"
            @blur="currentShape.value.value = iri ?? undefined"
          />
        </Field>
        <Field v-if="type === 'property'">
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
            <LanguageSelect v-model="labelLanguage" />
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
          <LanguageSelect v-model="descriptionLanguage" />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button v-if="open" color="background-blue" class="mt-2 w-full" @click="openOptions">
      <PanelRightOpenIcon /> Additional options
    </Button>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="type === 'node' ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
