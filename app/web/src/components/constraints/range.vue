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
import { computed, ref } from 'vue'

defineProps<ConstraintProps>()

const minimum = ref<number | undefined>(0)
const minimumInclusive = ref<boolean>(true)
const showMinimumInclusive = computed(() => typeof minimum.value !== 'undefined')

const maximum = ref<number | undefined>()
const maximumInclusive = ref<boolean>(true)
const showMaximumInclusive = computed(() => typeof maximum.value !== 'undefined')
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
      <InputOptional v-model="minimum" :create="() => 0" v-slot="{ remove }">
        <div class="items-center grid grid-cols-subgrid col-span-2">
          <InputGroup>
            <InputGroupInput v-model="minimum" type="number" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Checkbox v-model="minimumInclusive" class="justify-self-center" />
        </div>
      </InputOptional>
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

      <InputOptional v-model="maximum" :create="() => minimum ?? 0" v-slot="{ remove }">
        <div class="items-center grid grid-cols-subgrid col-span-2">
          <InputGroup>
            <InputGroupInput v-model="maximum" type="number" :min="minimum" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Checkbox v-model="maximumInclusive" class="justify-self-center" />
        </div>
      </InputOptional>
    </Field>
  </Constraint>
</template>
