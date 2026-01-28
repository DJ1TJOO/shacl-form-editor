<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList, FieldOptional } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Shacl, Xsd } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  booleanFromCheckboxValue,
  useCollection,
  useLiteral,
  useNamed
} from '@/composables/use-shacl'
import { formatDateInput, formatDateTimeInput } from '@/lib/date'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'
import { computed } from 'vue'
import { RDF_PROPERTY_TYPES } from '../rdf'

const { subject } = defineProps<ConstraintProps & { type: 'node' | 'property' }>()

const { value: closed } = useLiteral<boolean>({ subject, predicate: Shacl.SHACL('closed') })
const { items: ignoredProperties } = useCollection<NamedNode>({
  subject,
  predicate: Shacl.SHACL('ignoredProperties'),
})

const { value: datatype, node: datatypeNode } = useNamed({
  subject,
  predicate: Shacl.SHACL('datatype'),
  readonly: true,
})
const { value: nodeKind } = useNamed({
  subject,
  predicate: Shacl.SHACL('nodeKind'),
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
const { value: defaultValueNamed } = useNamed({
  subject,
  predicate: Shacl.SHACL('defaultValue'),
})
const defaultValue = computed({
  get() {
    if (nodeKind.value === Shacl.SHACL('IRI').value) {
      return defaultValueNamed.value
    }

    const value = defaultValueLiteral.value
    if (value instanceof Date) {
      return isDatatypeDateTime.value ? formatDateTimeInput(value) : formatDateInput(value)
    }
    return value
  },
  set(value) {
    if (nodeKind.value === Shacl.SHACL('IRI').value) {
      if (typeof value !== 'string' && typeof value !== 'undefined') return
      defaultValueNamed.value = value
      return
    }

    defaultValueDatatype.value = datatypeNode.value ?? Xsd.string
    defaultValueLiteral.value = value
  },
})
</script>

<template>
  <Constraint legend="Additional" :collapsible="collapsible">
    <Field v-if="type === 'property'">
      <FieldLabel>
        Default Value
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>This is content in a tooltip.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <FieldOptional
        v-if="nodeKind === Shacl.SHACL('IRI').value"
        v-model="defaultValueNamed"
        :create="() => ':'"
        v-slot="{ remove }"
      >
        <PrefixInput v-model="defaultValueNamed">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldOptional>
      <FieldOptional
        v-else
        v-model="defaultValue"
        :create="
          () => {
            if (isDatatypeDecimal || isDatatypeInteger) {
              return 0
            }

            if (isDatatypeDate) {
              return isDatatypeDateTime
                ? formatDateTimeInput(new Date())
                : formatDateInput(new Date())
            }

            return ''
          }
        "
        v-slot="{ remove }"
      >
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

    <Field v-if="type === 'node'">
      <FieldLabel>
        Closed
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            Whether this shape is closed. If checked, only explicitly defined properties are
            allowed.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <Checkbox
        :model-value="closed"
        @update:model-value="(value) => (closed = booleanFromCheckboxValue(value))"
      />
    </Field>

    <Field v-if="type === 'node'">
      <FieldLabel>
        Ignored properties
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Properties that are ignored when the shape is closed.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="ignoredProperties"
        :create="() => ({ node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.node.value" :types="RDF_PROPERTY_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>
  </Constraint>
</template>
