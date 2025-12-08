<script setup lang="ts">
import { absoluteToPrefixed, prefixedToAbsolute, tmpPrefixOptions } from '@/components/tmp-prefixes'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { InputGroup, InputGroupAddon, InputGroupComboboxInput } from '@/components/ui/input-group'

const prefix = defineModel<string>({ required: true })
</script>

<template>
  <Combobox v-model="prefix">
    <ComboboxAnchor>
      <InputGroup>
        <InputGroupComboboxInput
          :display-value="(prefix) => absoluteToPrefixed(prefix)"
          @blur="
            (e: Event) => {
              const target = e.target as HTMLInputElement
              prefix = prefixedToAbsolute(target.value)
            }
          "
        />

        <InputGroupAddon align="inline-end">
          <ComboboxTrigger />
          <slot />
        </InputGroupAddon>
      </InputGroup>
    </ComboboxAnchor>

    <ComboboxList hide-when-empty>
      <ComboboxGroup>
        <ComboboxItem v-for="option in tmpPrefixOptions" :key="option.value" :value="option.value">
          <div class="flex items-center gap-2">
            <ComboboxItemIndicator />
            <span> {{ option.label }}</span>
          </div>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
