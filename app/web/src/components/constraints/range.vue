<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { Shacl, Xsd } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useNamed } from '@/composables/use-shacl'
import { CalendarIcon, InfoIcon } from 'lucide-vue-next'
import { computed, useTemplateRef } from 'vue'

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function formatDateTime(date: Date) {
  return date.toISOString().split('.')[0]
}

const { subject } = defineProps<ConstraintProps>()

const { value: datatype, node: datatypeNode } = useNamed({
  subject,
  predicate: Shacl.SHACL('datatype'),
})
const isDatatypeDecimal = computed(() => (datatype.value ? Xsd.isDecimal(datatype.value) : false))
const isDatatypeInteger = computed(() => (datatype.value ? Xsd.isInteger(datatype.value) : false))
const isDatatypeDate = computed(() => (datatype.value ? Xsd.isDate(datatype.value) : false))
const isDatatypeDateTime = computed(() => (datatype.value ? Xsd.isDateTime(datatype.value) : false))

const minInputRef = useTemplateRef<{ inputRef: HTMLInputElement | null }>('minInput')
const { value: minExclusive, datatype: minExclusiveDatatype } = useLiteral<number | Date | string>({
  subject,
  predicate: Shacl.SHACL('minExclusive'),
})
const { value: minInclusive, datatype: minInclusiveDatatype } = useLiteral<number | Date | string>({
  subject,
  predicate: Shacl.SHACL('minInclusive'),
})

const isMinimumInclusive = computed({
  get() {
    return typeof minInclusive.value !== 'undefined'
  },
  set(value) {
    const currentValue = isMinimumInclusive.value ? minInclusive.value : minExclusive.value
    const currentDatatype = isMinimumInclusive.value
      ? minInclusiveDatatype.value
      : minExclusiveDatatype.value

    if (value) {
      minExclusive.value = undefined
      minInclusive.value = currentValue
      minInclusiveDatatype.value = currentDatatype
    } else {
      minInclusive.value = undefined
      minExclusive.value = currentValue
      minExclusiveDatatype.value = currentDatatype
    }
  },
})

const minimum = computed({
  get() {
    const value = isMinimumInclusive.value ? minInclusive.value : minExclusive.value
    if (value instanceof Date) {
      return isDatatypeDateTime.value ? formatDateTime(value) : formatDate(value)
    }
    return value
  },
  set(value) {
    const datatype = datatypeNode.value ?? Xsd.string
    if (isMinimumInclusive.value) {
      minInclusiveDatatype.value = datatype
      minInclusive.value = value
    } else {
      minExclusiveDatatype.value = datatype
      minExclusive.value = value
    }
  },
})
const showMinimumInclusiveLabel = computed(() => typeof minimum.value !== 'undefined')

const maxInputRef = useTemplateRef<{ inputRef: HTMLInputElement | null }>('maxInput')
const { value: maxExclusive, datatype: maxExclusiveDatatype } = useLiteral<number | Date | string>({
  subject,
  predicate: Shacl.SHACL('maxExclusive'),
})
const { value: maxInclusive, datatype: maxInclusiveDatatype } = useLiteral<number | Date | string>({
  subject,
  predicate: Shacl.SHACL('maxInclusive'),
})

const isMaximumInclusive = computed({
  get() {
    return typeof maxInclusive.value !== 'undefined'
  },
  set(value) {
    const currentValue = isMaximumInclusive.value ? maxInclusive.value : maxExclusive.value
    const currentDatatype = isMaximumInclusive.value
      ? maxInclusiveDatatype.value
      : maxExclusiveDatatype.value

    if (value) {
      maxExclusive.value = undefined
      maxInclusive.value = currentValue
      maxInclusiveDatatype.value = currentDatatype
    } else {
      maxInclusive.value = undefined
      maxExclusive.value = currentValue
      maxExclusiveDatatype.value = currentDatatype
    }
  },
})

const maximum = computed({
  get() {
    const value = isMaximumInclusive.value ? maxInclusive.value : maxExclusive.value
    if (value instanceof Date) {
      return isDatatypeDateTime.value ? formatDateTime(value) : formatDate(value)
    }
    return value
  },
  set(value) {
    const datatype = datatypeNode.value ?? Xsd.string
    if (isMaximumInclusive.value) {
      maxInclusiveDatatype.value = datatype
      maxInclusive.value = value
    } else {
      maxExclusiveDatatype.value = datatype
      maxExclusive.value = value
    }
  },
})
const showMaximumInclusiveLabel = computed(() => typeof maximum.value !== 'undefined')
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
        <FieldLabel v-if="showMinimumInclusiveLabel"> Inclusive </FieldLabel>
      </div>

      <AddButton
        v-if="typeof minimum === 'undefined'"
        @click="
          isDatatypeInteger
            ? (minimum = 0)
            : isDatatypeDate
              ? isDatatypeDateTime
                ? (minimum = formatDateTime(new Date()))
                : (minimum = formatDate(new Date()))
              : (minimum = '')
        "
      />
      <div v-else class="items-center grid grid-cols-subgrid col-span-2">
        <InputGroup>
          <InputGroupInput
            ref="minInput"
            v-model="minimum"
            :type="
              isDatatypeDecimal || isDatatypeInteger
                ? 'number'
                : isDatatypeDate
                  ? isDatatypeDateTime
                    ? 'datetime-local'
                    : 'date'
                  : 'text'
            "
            :step="isDatatypeDecimal ? 'any' : isDatatypeInteger ? 1 : undefined"
            class="hide-date-picker"
          />
          <InputGroupAddon align="inline-end">
            <Button
              v-if="isDatatypeDate"
              size="icon-sm"
              variant="ghost"
              @click="minInputRef?.inputRef?.showPicker()"
            >
              <CalendarIcon />
            </Button>
            <RemoveButton @click="minimum = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <Checkbox v-model="isMinimumInclusive" class="justify-self-center" />
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
        <FieldLabel v-if="showMaximumInclusiveLabel"> Inclusive </FieldLabel>
      </div>

      <AddButton
        v-if="typeof maximum === 'undefined'"
        @click="
          isDatatypeInteger
            ? (maximum = 0)
            : isDatatypeDate
              ? isDatatypeDateTime
                ? (maximum = formatDateTime(new Date()))
                : (maximum = formatDate(new Date()))
              : (maximum = '')
        "
      />
      <div v-else class="items-center grid grid-cols-subgrid col-span-2">
        <InputGroup>
          <InputGroupInput
            ref="maxInput"
            v-model="maximum"
            :type="
              isDatatypeDecimal || isDatatypeInteger
                ? 'number'
                : isDatatypeDate
                  ? isDatatypeDateTime
                    ? 'datetime-local'
                    : 'date'
                  : 'text'
            "
            :step="isDatatypeDecimal ? 'any' : isDatatypeInteger ? 1 : undefined"
            class="hide-date-picker"
          />
          <InputGroupAddon align="inline-end">
            <Button
              v-if="isDatatypeDate"
              size="icon-sm"
              variant="ghost"
              @click="maxInputRef?.inputRef?.showPicker()"
            >
              <CalendarIcon />
            </Button>
            <RemoveButton @click="maximum = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <Checkbox v-model="isMaximumInclusive" class="justify-self-center" />
      </div>
    </Field>
  </Constraint>
</template>
