<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList, FieldOptional } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Shacl, Xsd } from '@/components/rdf'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCollection, useLiteral, useNamed } from '@/composables/use-shacl'
import { formatDateInput, formatDateTimeInput } from '@/lib/date'
import { InfoIcon } from 'lucide-vue-next'
import { Literal, NamedNode } from 'rdflib'
import { computed } from 'vue'

const { subject } = defineProps<ConstraintProps>()

const { value: nodeKind } = useNamed({
  subject,
  predicate: Shacl.SHACL('nodeKind'),
  readonly: true,
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

const { value: hasValueLiteral } = useLiteral<string>({
  subject,
  predicate: Shacl.SHACL('hasValue'),
})
const { value: hasValueNamed } = useNamed({
  subject,
  predicate: Shacl.SHACL('hasValue'),
})
const hasValue = computed({
  get() {
    if (nodeKind.value === Shacl.SHACL('IRI').value) {
      return hasValueNamed.value
    }
    return hasValueLiteral.value
  },
  set(value: string | undefined) {
    if (nodeKind.value === Shacl.SHACL('IRI').value) {
      if (typeof value !== 'string' && typeof value !== 'undefined') return
      hasValueNamed.value = value
      return
    }
    hasValueLiteral.value = value
  },
})

const { items: inValues } = useCollection<NamedNode | Literal>({
  subject,
  predicate: Shacl.SHACL('in'),
})
</script>

<template>
  <Constraint legend="Value constraints" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Has value
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Wether the property matches the given value.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldOptional
        v-if="nodeKind === Shacl.SHACL('IRI').value"
        v-model="hasValueNamed"
        :create="() => ':'"
        v-slot="{ remove }"
      >
        <PrefixInput v-model="hasValueNamed">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldOptional>
      <FieldOptional v-else v-model="hasValue" :create="() => ''" v-slot="{ remove }">
        <InputGroup>
          <InputGroupInput
            v-model="hasValue"
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

    <Field>
      <FieldLabel>
        In
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be in the given list of values.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-if="nodeKind === Shacl.SHACL('IRI').value"
        v-slot="{ entry, remove }"
        v-model="inValues"
        :create="() => ({node: new NamedNode(':')})"
      >
        <PrefixInput v-model="entry.node.value">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
      <FieldList
        v-else
        v-slot="{ entry, remove }"
        v-model="inValues"
        :create="
          () => {
            if (isDatatypeDecimal || isDatatypeInteger) {
              return { node: new Literal('0', undefined, datatypeNode!) }
            }

            if (isDatatypeDate) {
              const value = isDatatypeDateTime ? formatDateTimeInput(new Date()) : formatDateInput(new Date())
              return { node: new Literal(value, undefined, datatypeNode!) }
            }

            return { node: new Literal('', undefined, datatypeNode ?? Xsd.string) }
          }"
      >
        <InputGroup>
          <InputGroupInput
            v-model="entry.node.value"
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
      </FieldList>
    </Field>
  </Constraint>
</template>
