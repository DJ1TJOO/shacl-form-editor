<script setup lang="ts">
import {
  AdditionalConstraints,
  TargetConstraints,
  ValidationConstraints,
} from '@/components/constraints'
import { useFile } from '@/components/file'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList } from '@/components/form-ui/field'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { properties } from '@/components/properties'
import { Dash, RDFS, RDF_PROPERTY_TYPES, Shacl, Xsd } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useLiteralList, useNamed, useShapeType } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'
import { computed, ref, watch } from 'vue'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const { currentShape } = useFile()
const type = useShapeType({ subject: currentShape.node })

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
  predicate: type.value === 'property' ? Shacl.SHACL('name') : RDFS('label'),
})
const { items: descriptions } = useLiteralList({
  subject: currentShape.node,
  predicate: type.value === 'property' ? Shacl.SHACL('description') : RDFS('comment'),
})
const { value: path } = useNamed({
  subject: currentShape.node,
  predicate: Shacl.SHACL('path'),
})

const { value: editor } = useNamed({
  subject: currentShape.node,
  predicate: Dash.DASH('editor'),
  readonly: true,
})
const propertyDefinition = computed(() => {
  if (type.value !== 'property') return undefined
  if (!currentShape.node.value) return undefined

  return properties.find((property) => {
    if (!property.editor && editor.value === undefined) return true
    if (!property.editor) return false

    return Dash.editors[property.editor].value === editor.value
  })
})
</script>

<template>
  <DefineOptions>
    <AdditionalConstraints v-if="type" :type="type" :subject="currentShape.node.value" />
    <FieldSeparator v-if="type === 'node'" />
    <ValidationConstraints v-if="type === 'node'" :subject="currentShape.node.value" collapsible />
  </DefineOptions>
  <div
    data-slot="shape"
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
        <component v-if="propertyDefinition" :is="propertyDefinition.icon" />
        {{ propertyDefinition?.label ?? 'Property' }}
      </FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>
            Shape IRI
            <Tooltip>
              <TooltipTrigger><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <PrefixInput
            v-if="iri"
            v-model="iri"
            placeholder="ex:MyNode"
            no-suggestions
            @blur="currentShape.value.value = iri ?? undefined"
          />
        </Field>
        <Field v-if="type === 'property'">
          <FieldLabel>
            Path
            <Tooltip>
              <TooltipTrigger><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <PrefixInput v-model="path" placeholder="ex:path" :types="RDF_PROPERTY_TYPES" />
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
            :create="
              () => ({
                value: '',
                language: undefined,
                datatype: Xsd.string,
                node: new Literal(''),
              })
            "
            list-class="grid grid-cols-subgrid col-span-2"
            class="grid grid-cols-subgrid col-span-2"
          >
            <InputGroup>
              <InputGroupInput v-model="entry.value" placeholder="My Node" />
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
            :create="
              () => ({
                value: '',
                language: undefined,
                datatype: Xsd.string,
                node: new Literal(''),
              })
            "
            focus-element="textarea"
            class="space-y-0.5 has-[+div]:mb-2"
          >
            <Textarea v-model="entry.value" placeholder="This is a node with a description" />
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
    <TargetConstraints
      class="mt-2"
      v-if="type === 'node' && open"
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
