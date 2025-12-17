<script setup lang="ts">
import {
  AdditionalConstraints,
  TargetConstraints,
  ValidationConstraints,
} from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { injectFileContext, RDF, Shacl, Xsd } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useLiteralList, useNamed, useNamedList } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon, TypeIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'
import { computed, ref, watch } from 'vue'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const { currentShape } = injectFileContext()
const { items: types } = useNamedList({ subject: currentShape.node, predicate: RDF('type') })
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
    `shape-options-${currentShape.node.value ? Shacl.getLocalName(currentShape.node.value) : ''}`,
  ),
  `Options for ${currentShape.node.value ? Shacl.getLocalName(currentShape.node.value) : ''}`,
  { allowGrouping: false },
)

const { items: labels } = useLiteralList({
  subject: currentShape.node,
  predicate: Shacl.SHACL('name'),
})
const { items: descriptions } = useLiteralList({
  subject: currentShape.node,
  predicate: Shacl.SHACL('description'),
})
const { value: path } = useNamed({
  subject: currentShape.node,
  predicate: Shacl.SHACL('path'),
})
</script>

<template>
  <DefineOptions>
    <AdditionalConstraints v-if="type" :type="type" :subject="currentShape.node.value" />
    <FieldSeparator v-if="type === 'node'" />
    <ValidationConstraints v-if="type === 'node'" :subject="currentShape.node.value" collapsible />
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
            Shape IRI
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
            <FieldLabel v-if="labels.length > 0"> Language </FieldLabel>
          </div>
          <div
            class="grid grid-cols-subgrid col-span-2"
            v-for="(label, index) in labels"
            :key="index"
          >
            <InputGroup>
              <InputGroupInput v-model="label.value" placeholder="My Node" />
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
                datatype: Xsd.string,
                node: new Literal(''),
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
            <Textarea v-model="description.value" placeholder="This is a node with a description" />
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
                datatype: Xsd.string,
                node: new Literal(''),
              })
            "
          />
        </Field>
      </FieldGroup>
    </FieldSet>
    <TargetConstraints
      class="mt-2"
      v-if="type === 'node'"
      :subject="currentShape.node.value"
      collapsible
    />
    <Button v-if="open" color="background-blue" class="mt-2 w-full" @click="openOptions">
      <PanelRightOpenIcon /> Additional options
    </Button>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="type === 'node' ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
