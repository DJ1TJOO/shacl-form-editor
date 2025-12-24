<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { RDF_PROPERTY_TYPES, Shacl, Xsd } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { booleanFromCheckboxValue, useNamed, useNamedList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'
import { computed } from 'vue'

const { subject, noLessThan = false } = defineProps<ConstraintProps & { noLessThan?: boolean }>()

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

const { value: datatype } = useNamed({
  subject,
  predicate: Shacl.SHACL('datatype'),
  readonly: true,
})
const canHaveLessThanConstraints = computed(() => {
  return !datatype.value || (!Xsd.isString(datatype.value) && !Xsd.isBoolean(datatype.value))
})

const lessThanOrEqualsMax = computed(() => lessThanOrEquals.length) // Too disable the add button in the first field list
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

      <FieldList
        v-slot="{ entry, remove }"
        v-model="equals"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_PROPERTY_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
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

      <FieldList
        v-slot="{ entry, remove }"
        v-model="disjoint"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_PROPERTY_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>

    <Field
      class="gap-x-1 gap-y-0.5 grid grid-cols-[1fr_auto]"
      v-if="canHaveLessThanConstraints && !noLessThan"
    >
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

      <FieldList
        v-slot="{ entry, remove }"
        v-model="lessThanOrEquals"
        :create="() => ({ value: '', node: new NamedNode(':') })"
        :max="lessThanOrEqualsMax"
        list-class="grid grid-cols-subgrid col-span-2"
        class="items-center grid grid-cols-subgrid col-span-2"
      >
        <PrefixInput v-model="entry.value" :types="RDF_PROPERTY_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
        <Checkbox
          :default-value="true"
          @update:model-value="
            (value) => {
              if (!booleanFromCheckboxValue(value)) {
                lessThan.push({
                  value: entry.value,
                  node: entry.node,
                })
                remove?.()
              }
            }
          "
          class="justify-self-center"
        />
      </FieldList>
      <FieldList
        v-slot="{ entry, remove }"
        v-model="lessThan"
        :create="() => ({ value: '', node: new NamedNode(':') })"
        list-class="grid grid-cols-subgrid col-span-2"
        class="items-center grid grid-cols-subgrid col-span-2"
      >
        <PrefixInput v-model="entry.value" :types="RDF_PROPERTY_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
        <Checkbox
          :default-value="false"
          @update:model-value="
            (value) => {
              if (booleanFromCheckboxValue(value)) {
                lessThanOrEquals.push({ value: entry.value, node: entry.node })
                remove?.()
              }
            }
          "
          class="justify-self-center"
        />
      </FieldList>
    </Field>
  </Constraint>
</template>
