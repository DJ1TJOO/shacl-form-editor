<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { Shacl } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { computed } from 'vue'
const { subject } = defineProps<ConstraintProps>()

const { value: minimum } = useLiteral<number>({ subject, predicate: Shacl.SHACL('minCount') })
const { value: maximum } = useLiteral<number>({ subject, predicate: Shacl.SHACL('maxCount') })

const required = computed<boolean | 'indeterminate'>({
  get: () => {
    const minVal = minimum.value
    const maxVal = maximum.value
    return minVal === 1 && maxVal === 1 ? true : minVal ? 'indeterminate' : false
  },
  set: (value) => {
    minimum.value = value ? 1 : undefined
    maximum.value = value ? 1 : undefined
  },
})
</script>

<template>
  <Constraint legend="Cardinality constraints" :collapsible="collapsible">
    <div class="gap-1 grid grid-cols-3">
      <Field>
        <FieldLabel>
          Required
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Minimum and maximum will set to 1.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <Checkbox v-model="required" />
      </Field>
      <Field>
        <FieldLabel>
          Minimum
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Minimum number of occurrences.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <AddButton v-if="typeof minimum === 'undefined'" @click="minimum = 1" />
        <InputGroup v-else>
          <InputGroupInput
            v-model="minimum"
            :min="1"
            :max="maximum"
            default-value="1"
            type="number"
          />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="minimum = undefined" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel>
          Maximum
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Maximum number of occurrences.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <AddButton v-if="typeof maximum === 'undefined'" @click="maximum = minimum ?? 1" />
        <InputGroup v-else>
          <InputGroupInput v-model="maximum" :min="minimum ?? 1" default-value="1" type="number" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="maximum = undefined" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  </Constraint>
</template>
