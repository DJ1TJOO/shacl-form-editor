<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Shacl } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { booleanFromCheckboxValue, useNamedList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'

const { subject } = defineProps<ConstraintProps>()

const { items: equals } = useNamedList({ subject, predicate: Shacl.SHACL('equals') })
const { items: disjoint } = useNamedList({ subject, predicate: Shacl.SHACL('disjoint') })
// @TODO: should only be visible when no datatype, datatype is range variant, datatype variant is unknown
const { items: lessThan } = useNamedList({
  subject,
  predicate: Shacl.SHACL('lessThan'),
})
const { items: lessThanOrEquals } = useNamedList({
  subject,
  predicate: Shacl.SHACL('lessThanOrEquals'),
})
</script>

<template>
  <Constraint legend="Pair constraints" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Equals
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be equal to all given properties.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <template v-for="(equalsEntry, index) in equals" :key="index">
        <PrefixInput v-model="equalsEntry.value">
          <RemoveButton @click="equals.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="equals.push({ value: '', node: new NamedNode(':') })" />
    </Field>

    <Field>
      <FieldLabel>
        Disjoint
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            The property value must be disjoint with all given properties.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>

      <template v-for="(disjointEntry, index) in disjoint" :key="index">
        <PrefixInput v-model="disjointEntry.value">
          <RemoveButton @click="disjoint.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="disjoint.push({ value: '', node: new NamedNode(':') })" />
    </Field>

    <Field class="gap-x-1 gap-y-0.5 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Less than
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The property value must be disjoint with all given properties.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="lessThan?.length > 0 || lessThanOrEquals?.length > 0">
          or equals
        </FieldLabel>
      </div>

      <div
        class="items-center grid grid-cols-subgrid col-span-2"
        v-for="(lessThanEntry, index) in lessThan"
        :key="lessThanEntry.node.value"
      >
        <PrefixInput v-model="lessThanEntry.value">
          <RemoveButton @click="lessThan.splice(index, 1)" />
        </PrefixInput>
        <Checkbox
          :default-value="false"
          @update:model-value="
            (value) => {
              if (booleanFromCheckboxValue(value)) {
                lessThanOrEquals.push({ value: lessThanEntry.value, node: lessThanEntry.node })
                lessThan.splice(index, 1)
              }
            }
          "
          class="justify-self-center"
        />
      </div>
      <div
        class="items-center grid grid-cols-subgrid col-span-2"
        v-for="(lessThanOrEqualsEntry, index) in lessThanOrEquals"
        :key="lessThanOrEqualsEntry.node.value"
      >
        <PrefixInput v-model="lessThanOrEqualsEntry.value">
          <RemoveButton @click="lessThanOrEquals.splice(index, 1)" />
        </PrefixInput>
        <Checkbox
          :default-value="true"
          @update:model-value="
            (value) => {
              if (!booleanFromCheckboxValue(value)) {
                lessThan.push({
                  value: lessThanOrEqualsEntry.value,
                  node: lessThanOrEqualsEntry.node,
                })
                lessThanOrEquals.splice(index, 1)
              }
            }
          "
          class="justify-self-center"
        />
      </div>
      <AddButton @click="lessThan.push({ value: '', node: new NamedNode(':') })" />
    </Field>
  </Constraint>
</template>
