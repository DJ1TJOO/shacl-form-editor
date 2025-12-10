<script setup lang="ts">
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { languages, type Language } from './languages'

import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { ComboboxVirtualizer, useFilter, useForwardPropsEmits } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<ComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const filter = ref('')
const { contains } = useFilter({ sensitivity: 'base' })
const filteredLanguages = computed(() => {
  const filtered = languages.filter((language) =>
    contains(`${language.label} (${language.code})`, filter.value),
  )

  const forwardedValue = forwarded.value
  const modelValue = forwardedValue.modelValue
  const selectedCodes = forwardedValue.multiple
    ? Array.isArray(modelValue)
      ? modelValue
      : []
    : modelValue
      ? [modelValue]
      : []

  return filtered.sort((a, b) => {
    const aSelected = selectedCodes.includes(a.code)
    const bSelected = selectedCodes.includes(b.code)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })
})
</script>

<template>
  <Combobox v-bind="forwarded">
    <ComboboxAnchor>
      <div class="relative items-center">
        <ComboboxInput
          :placeholder="
            forwarded.multiple
              ? Array.isArray(forwarded.modelValue) && forwarded.modelValue.length > 0
                ? forwarded.modelValue.join(', ')
                : 'Unset'
              : 'Unset'
          "
          v-model="filter"
        />
        <ComboboxTrigger class="absolute inset-y-0 flex justify-center items-center px-3 end-0" />
      </div>
    </ComboboxAnchor>

    <ComboboxList align="end" class="w-48">
      <ComboboxEmpty> No language found. </ComboboxEmpty>

      <!-- @TODO: Breaks when using ComboboxGroup, why? -->
      <!-- @TODO: opens and closes very slowly, even with virtualizer -->
      <div class="p-1">
        <ComboboxItem :value="null" v-if="!forwarded.multiple">
          <ComboboxItemIndicator />
          Unset
        </ComboboxItem>
        <ComboboxVirtualizer
          v-slot="{ option, virtualizer }"
          :options="filteredLanguages"
          :text-content="(x: Language) => x.label"
          :estimate-size="32"
        >
          <div :ref="(node) => virtualizer.measureElement(node as Element)" class="w-full">
            <ComboboxItem :key="option.code" :value="option.code">
              <ComboboxItemIndicator />
              {{ option.label }}
            </ComboboxItem>
          </div>
        </ComboboxVirtualizer>
      </div>
    </ComboboxList>
  </Combobox>
</template>
