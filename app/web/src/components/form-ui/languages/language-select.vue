<script setup lang="ts">
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { languages } from './languages'

import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { useFilter, useForwardPropsEmits } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<ComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const filter = ref('')
const { contains } = useFilter({ sensitivity: 'base' })
const filteredLanguages = computed(() => {
  const filtered = languages.filter((language) =>
    contains(`${language.label} ${language.code}`, filter.value),
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
  <Combobox v-bind="forwarded" ignore-filter>
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

      <ComboboxGroup>
        <ComboboxItem :value="null" v-if="!forwarded.multiple">
          <ComboboxItemIndicator />
          Unset
        </ComboboxItem>
        <ComboboxItem
          v-for="language in filteredLanguages"
          :key="language.code"
          :value="language.code"
        >
          <ComboboxItemIndicator />
          {{ language.label }}
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
