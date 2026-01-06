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

import { reactiveOmit } from '@vueuse/core'
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { useFilter, useForwardPropsEmits } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<ComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const comboboxPropsWithoutModel = reactiveOmit(props, 'modelValue')
const forwarded = useForwardPropsEmits(comboboxPropsWithoutModel, emits)

const language = defineModel<string | string[] | null>()

const filter = ref('')
const { contains } = useFilter({ sensitivity: 'base' })
const filteredLanguages = computed(() => {
  const filtered = languages.filter((language) =>
    contains(`${language.label} ${language.code}`, filter.value),
  )

  const selectedLanguage = language.value
  const selectedCodes = Array.isArray(selectedLanguage)
    ? selectedLanguage
    : selectedLanguage
      ? [selectedLanguage]
      : []

  return filtered.toSorted((a, b) => {
    const filterLower = filter.value.toLowerCase()
    const aCodeMatch = a.code.toLowerCase().startsWith(filterLower)
    const bCodeMatch = b.code.toLowerCase().startsWith(filterLower)

    if (aCodeMatch && !bCodeMatch) return -1
    if (!aCodeMatch && bCodeMatch) return 1

    const aSelected = selectedCodes.includes(a.code)
    const bSelected = selectedCodes.includes(b.code)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })
})
</script>

<template>
  <Combobox v-model="language" v-bind="forwarded" ignore-filter>
    <ComboboxAnchor>
      <div class="relative items-center">
        <ComboboxInput
          :placeholder="
            forwarded.multiple
              ? Array.isArray(language) && language.length > 0
                ? language.join(', ')
                : 'Unset'
              : 'Unset'
          "
          @blur="
            (e: FocusEvent) => {
              if (forwarded.multiple || Array.isArray(language)) return
              const target = e.target as HTMLInputElement

              const foundLanguage = languages.find((language) => language.code === target.value)
              if (!foundLanguage) return

              language = foundLanguage.code
            }
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
