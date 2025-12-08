<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { PrefixInput } from '@/components/form-ui/prefix'
import { RDF, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { booleanFromCheckboxValue, useLiteral, useNamedList } from '@/composables/use-shacl'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'

const { subject } = defineProps<ConstraintProps & { type: 'node' | 'property' }>()

const { value: closed } = useLiteral<boolean>({ subject, predicate: Shacl.SHACL('closed') })
const types = useNamedList({ subject, predicate: RDF('type') })
const ignoredProperties = useNamedList({ subject, predicate: Shacl.SHACL('ignoredProperties') })
</script>

<template>
  <Constraint legend="Additional">
    <Field>
      <FieldLabel>
        Type
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Additional RDF types.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <template v-for="(type, index) in types" :key="index">
        <PrefixInput
          v-model="type.value"
          v-if="
            type.value !== Shacl.SHACL('NodeShape').value &&
            type.value !== Shacl.SHACL('PropertyShape').value
          "
        >
          <RemoveButton @click="types.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="types.push({ value: '', node: new NamedNode(':') })" />
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

      <template v-for="(property, index) in ignoredProperties" :key="index">
        <PrefixInput v-model="property.value">
          <Button
            size="icon-sm"
            variant="ghost"
            color="danger"
            @click="ignoredProperties.splice(index, 1)"
          >
            <XIcon />
          </Button>
        </PrefixInput>
      </template>
      <Button
        size="sm"
        variant="outline"
        color="background-blue"
        class="w-fit!"
        @click="ignoredProperties.push({ value: '', node: new NamedNode(':') })"
      >
        Add
      </Button>
    </Field>

    <!-- @TODO: Create something to add any rdf property -->
  </Constraint>
</template>
