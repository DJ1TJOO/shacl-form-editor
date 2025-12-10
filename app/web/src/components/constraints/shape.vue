<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupComboboxInput,
  InputGroupInput,
} from '@/components/ui/input-group'
import { InputOptional } from '@/components/ui/input-optional'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'

defineProps<ConstraintProps>()

const shape = ref<string | undefined>()
const hasShape = computed(() => typeof shape.value !== 'undefined')
const inline = ref<boolean>(false)

const minQualified = ref<number | undefined>(5)
const maxQualified = ref<number | undefined>()
const disjoint = ref<boolean | 'indeterminate'>(false)

const shapeOptions = ['ex:MyNode', 'ex:MyNodeOther', 'ex:AddressShape', 'ex:ContactShape']
</script>

<!-- @TODO: implementation when creating subshape property -->
<template>
  <Constraint legend="Shape constraints" :collapsible="collapsible">
    <Field class="gap-1 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Shape
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The shape that values of this property must conform to.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="hasShape">
          Inline
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Whether the shape is defined inline.</TooltipContent>
          </Tooltip>
        </FieldLabel>
      </div>

      <InputOptional v-model="shape" :create="() => ''" v-slot="{ remove }">
        <div class="items-center grid grid-cols-subgrid col-span-2">
          <Combobox v-model="shape" :reset-search-term-on-blur="false">
            <ComboboxAnchor>
              <InputGroup>
                <InputGroupComboboxInput
                  @input="
                    (e: Event) => {
                      const target = e.target as HTMLInputElement
                      shape = target.value
                    }
                  "
                  @blur="
                    (e: Event) => {
                      const target = e.target as HTMLInputElement
                      shape = target.value
                    }
                  "
                />
                <InputGroupAddon align="inline-end">
                  <ComboboxTrigger />
                  <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                    <XIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </ComboboxAnchor>

            <ComboboxList>
              <ComboboxEmpty> No results. </ComboboxEmpty>

              <ComboboxGroup>
                <ComboboxItem v-for="option in shapeOptions" :key="option" :value="option">
                  <div class="flex items-center gap-2">
                    <ComboboxItemIndicator />
                    <span> {{ option }}</span>
                  </div>
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
            </ComboboxList>
          </Combobox>
          <Checkbox v-model="inline" class="justify-self-center" />
        </div>
      </InputOptional>
    </Field>

    <div class="gap-1 grid grid-cols-[1fr_1fr_auto]">
      <Field>
        <FieldLabel>
          Minimum Qualified
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The minimum number of value nodes that must conform to the given
              shape.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <InputOptional v-model="minQualified" :create="() => 5" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="minQualified" type="number" :min="0" />
            <InputGroupAddon align="inline-end">
              <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>

      <Field>
        <FieldLabel>
          Maximum Qualified
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The maximum number of value nodes that may conform to the given
              shape.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <InputOptional v-model="maxQualified" :create="() => minQualified ?? 5" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="maxQualified" type="number" :min="minQualified ?? 0" />
            <InputGroupAddon align="inline-end">
              <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>

      <Field>
        <FieldLabel>
          Disjoint
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >When checked, value nodes that conform to this shape may not conform to other
              qualified shapes.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <Checkbox v-model="disjoint" />
      </Field>
    </div>
  </Constraint>
</template>
