<script setup lang="ts">
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList, FieldOptional } from '@/components/form-ui/field'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { RDF_PROPERTY_TYPES, Shacl, Xsd } from '@/components/rdf'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useLiteralList, useNamed } from '@/composables/use-shacl'
import { formatDateInput, formatDateTimeInput } from '@/lib/date'
import { InfoIcon } from 'lucide-vue-next'
import { Literal, NamedNode } from 'rdflib'
import type { BlankNode } from 'rdflib/lib/tf-types'
import { computed } from 'vue'

const { subject } = defineProps<{
  subject: BlankNode | NamedNode
}>()

const { value: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const { items: labels } = useLiteralList({ subject, predicate: Shacl.SHACL('name') })
const { items: descriptions } = useLiteralList({
  subject,
  predicate: Shacl.SHACL('description'),
})

const { value: datatype, node: datatypeNode } = useNamed({
  subject,
  predicate: Shacl.SHACL('datatype'),
  readonly: true,
})
const isDatatypeDecimal = computed(() => (datatype.value ? Xsd.isDecimal(datatype.value) : false))
const isDatatypeInteger = computed(() => (datatype.value ? Xsd.isInteger(datatype.value) : false))
const isDatatypeDate = computed(() => (datatype.value ? Xsd.isDate(datatype.value) : false))
const isDatatypeDateTime = computed(() => (datatype.value ? Xsd.isDateTime(datatype.value) : false))
const { value: defaultValueLiteral, datatype: defaultValueDatatype } = useLiteral<
  number | Date | string
>({
  subject,
  predicate: Shacl.SHACL('defaultValue'),
})
const defaultValue = computed({
  get() {
    const value = defaultValueLiteral.value
    if (value instanceof Date) {
      return isDatatypeDateTime.value ? formatDateTimeInput(value) : formatDateInput(value)
    }
    return value
  },
  set(value) {
    defaultValueDatatype.value = datatypeNode.value ?? Xsd.string
    defaultValueLiteral.value = value
  },
})
</script>

<template>
  <FieldSet>
    <FieldGroup>
      <Field>
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
            () => ({ value: '', language: undefined, datatype: Xsd.string, node: new Literal('') })
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
            () => ({ value: '', language: undefined, datatype: Xsd.string, node: new Literal('') })
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

      <Field>
        <FieldLabel>
          Default Value
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldOptional v-model="defaultValue" :create="() => ''" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput
              v-model="defaultValue"
              :type="
                isDatatypeDecimal || isDatatypeInteger
                  ? 'number'
                  : isDatatypeDate
                    ? isDatatypeDateTime
                      ? 'datetime-local'
                      : 'date'
                    : 'text'
              "
            />
            <InputGroupAddon align="inline-end">
              <RemoveButton @click="remove" />
            </InputGroupAddon>
          </InputGroup>
        </FieldOptional>
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
