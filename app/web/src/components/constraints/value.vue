<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
import { InputOptional } from '@/components/ui/input-optional'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

const hasValue = ref(undefined)
// @TODO: This does not work until we fix the InputList component
const inValues = ref<InValue[]>([])

type InValue = {
  id: number
  value: string
}

let nextId = 0

const createInValue = (): InValue => ({
  id: nextId++,
  value: '',
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
      <InputOptional v-model="hasValue" :create="() => ''" v-slot="{ remove }">
        <InputGroup>
          <!-- @TODO: Input type for value should be based on the datatype or a iri -->
          <InputGroupInput v-model="hasValue" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" variant="ghost" color="danger" @click="remove">
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </InputOptional>
    </Field>

    <Field>
      <FieldLabel
        >In
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be in the given list of values.</TooltipContent>
        </Tooltip></FieldLabel
      >
      <InputList
        v-model="inValues"
        :min="0"
        :create="createInValue"
        :get-key="(entry: InValue) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <InputGroup>
          <!-- @TODO: Input type for value should be based on the datatype or a iri -->
          <InputGroupInput v-model="entry.value" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              variant="ghost"
              color="danger"
              v-if="isRemovable"
              @click="remove"
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </InputList>
    </Field>
  </Constraint>
</template>
