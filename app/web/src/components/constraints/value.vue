<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { Shacl, Xsd } from '@/components/rdf'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useLiteralList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'

const { subject } = defineProps<ConstraintProps>()

// @TODO: Input type for value should be based on the datatype, class and/or nodekind. It could be a named node or a literal.
const { value: hasValue } = useLiteral<string>({ subject, predicate: Shacl.SHACL('hasValue') })
const { items: inValues } = useLiteralList({ subject, predicate: Shacl.SHACL('in') })
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

      <InputGroup v-if="typeof hasValue === 'string'">
        <InputGroupInput v-model="hasValue" />
        <InputGroupAddon align="inline-end">
          <RemoveButton @click="hasValue = undefined" />
        </InputGroupAddon>
      </InputGroup>
      <AddButton v-else @click="hasValue = ''" />
    </Field>

    <Field>
      <FieldLabel>
        In
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be in the given list of values.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <template v-for="(inValue, index) in inValues" :key="index">
        <InputGroup>
          <InputGroupInput v-model="inValue.value" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="inValues.splice(index, 1)" />
          </InputGroupAddon>
        </InputGroup>
      </template>
      <AddButton
        @click="inValues.push({ value: '', node: new Literal(''), datatype: Xsd.string })"
      />
    </Field>
  </Constraint>
</template>
