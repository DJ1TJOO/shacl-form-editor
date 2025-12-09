<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { Shacl, Xsd } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useNamed } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

const { subject } = defineProps<ConstraintProps>()

const { value: datatype } = useNamed({ subject, predicate: Shacl.SHACL('datatype') })
const isDatatypeDecimal = computed(() => (datatype.value ? Xsd.isDecimal(datatype.value) : false))
const isDatatypeInteger = computed(() => (datatype.value ? Xsd.isInteger(datatype.value) : false))

const minimumInclusive = ref<boolean | 'indeterminate'>(false)
const minimumPredicate = computed(() =>
  Shacl.SHACL(minimumInclusive.value === true ? 'minInclusive' : 'minExclusive'),
)
const { value: minimum } = useLiteral<number | string>({
  subject,
  predicate: minimumPredicate,
})
const showMinimumInclusive = computed(() => typeof minimum.value !== 'undefined')

const { value: minInclusive } = useLiteral<number | string>({
  subject,
  predicate: Shacl.SHACL('minInclusive'),
})
watch(
  minInclusive,
  (newMinInclusive) => {
    minimumInclusive.value = typeof newMinInclusive === 'undefined' ? false : true
  },
  { immediate: true },
)

const maximumInclusive = ref<boolean | 'indeterminate'>(false)
const maximumPredicate = computed(() =>
  Shacl.SHACL(maximumInclusive.value === true ? 'maxInclusive' : 'maxExclusive'),
)
const { value: maximum } = useLiteral<number | string>({
  subject,
  predicate: maximumPredicate,
})
const showMaximumInclusive = computed(() => typeof maximum.value !== 'undefined')

const { value: maxInclusive } = useLiteral<number | string>({
  subject,
  predicate: Shacl.SHACL('maxInclusive'),
})
watch(
  maxInclusive,
  (newMaxInclusive) => {
    maximumInclusive.value = typeof newMaxInclusive === 'undefined' ? false : true
  },
  { immediate: true },
)
</script>

<template>
  <Constraint legend="Range constraints" :collapsible="collapsible">
    <Field class="gap-1 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Min
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The minimum value allowed for this property.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="showMinimumInclusive"> Inclusive </FieldLabel>
      </div>

      <AddButton v-if="typeof minimum === 'undefined'" @click="minimum = 0" />
      <div v-else class="items-center grid grid-cols-subgrid col-span-2">
        <InputGroup>
          <InputGroupInput
            v-model="minimum"
            :type="isDatatypeDecimal || isDatatypeInteger ? 'number' : 'text'"
            :step="isDatatypeDecimal ? 'any' : isDatatypeInteger ? 1 : undefined"
          />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="minimum = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <Checkbox v-model="minimumInclusive" class="justify-self-center" />
      </div>
    </Field>

    <Field class="gap-1 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Max
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The maximum value allowed for this property.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="showMaximumInclusive"> Inclusive </FieldLabel>
      </div>

      <AddButton v-if="typeof maximum === 'undefined'" @click="maximum = 0" />
      <div v-else class="items-center grid grid-cols-subgrid col-span-2">
        <InputGroup>
          <InputGroupInput
            v-model="maximum"
            :type="isDatatypeDecimal || isDatatypeInteger ? 'number' : 'text'"
            :step="isDatatypeDecimal ? 'any' : isDatatypeInteger ? 1 : undefined"
          />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="maximum = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <Checkbox v-model="maximumInclusive" class="justify-self-center" />
      </div>
    </Field>
  </Constraint>
</template>
