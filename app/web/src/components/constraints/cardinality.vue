<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { InputOptional } from '@/components/ui/input-optional'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'

defineProps<ConstraintProps>()

const required = ref<boolean | 'indeterminate'>(false)
const minimum = ref<number | undefined>(undefined)
const maximum = ref<number | undefined>(undefined)

watch(
  () => [minimum.value, maximum.value],
  ([minimum, maximum]) => {
    required.value = minimum === 1 && maximum === 1 ? true : minimum ? 'indeterminate' : false
  },
)
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
        <Checkbox
          v-model="required"
          @update:model-value="
            (value) => {
              minimum = value ? 1 : undefined
              maximum = value ? 1 : undefined
            }
          "
        />
      </Field>
      <Field>
        <FieldLabel>
          Minimum
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Minimum number of occurrences.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <InputOptional v-model="minimum" :create="() => 1" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput
              v-model="minimum"
              :min="1"
              :max="maximum"
              default-value="1"
              type="number"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>
      <Field>
        <FieldLabel>
          Maximum
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Maximum number of occurrences.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <InputOptional v-model="maximum" :create="() => minimum ?? 1" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="maximum" :min="minimum" default-value="1" type="number" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>
    </div>
  </Constraint>
</template>
