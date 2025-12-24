<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList, FieldOptional } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { RDF, RDF_CLASS_TYPES, Shacl } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { booleanFromCheckboxValue, useLiteral, useNamedList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'

const { subject } = defineProps<ConstraintProps & { type: 'node' | 'property' }>()

const { value: closed } = useLiteral<boolean>({ subject, predicate: Shacl.SHACL('closed') })
const { items: types } = useNamedList({ subject, predicate: RDF('type') })
const { items: ignoredProperties } = useNamedList({
  subject,
  predicate: Shacl.SHACL('ignoredProperties'),
})
const { value: defaultValue } = useLiteral({
  subject,
  predicate: Shacl.SHACL('defaultValue'),
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
      <FieldOptional v-model="defaultValue" :create="() => ''" v-slot="{ remove }">
        <InputGroup>
          <InputGroupInput v-model="defaultValue" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="remove" />
          </InputGroupAddon>
        </InputGroup>
      </FieldOptional>
    </Field>
    <Field>
      <FieldLabel>
        Type
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Additional RDF types.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="types"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput
          v-if="
            entry.value !== Shacl.SHACL('NodeShape').value &&
            entry.value !== Shacl.SHACL('PropertyShape').value
          "
          :types="RDF_CLASS_TYPES"
          v-model="entry.value"
        >
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
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
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="[Shacl.SHACL('PropertyShape').value]">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>

    <!-- @TODO: Create something to add any rdf property -->
  </Constraint>
</template>
