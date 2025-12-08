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
  return languages.filter((language) =>
    contains(`${language.label} (${language.code})`, filter.value),
  )
})
</script>

<template>
  <Combobox v-bind="forwarded">
    <ComboboxAnchor>
      <div class="relative items-center">
        <ComboboxInput placeholder="Unset" v-model="filter" />
        <ComboboxTrigger class="absolute inset-y-0 flex justify-center items-center px-3 end-0" />
      </div>
    </ComboboxAnchor>

    <ComboboxList align="end" class="w-48">
      <ComboboxEmpty> No language found. </ComboboxEmpty>

      <!-- @TODO: Breaks when using ComboboxGroup, why? -->
      <div class="p-1">
        <ComboboxItem :value="null">
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
