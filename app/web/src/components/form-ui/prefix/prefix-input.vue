<script setup lang="ts" generic="T extends string | undefined">
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
import { reactiveOmit } from '@vueuse/core'
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxRootProps & {
    onBlur?: HTMLAttributes['onBlur']
  } & /* @vue-ignore */ InputHTMLAttributes
>()
const emits = defineEmits<ComboboxRootEmits>()

const comboboxPropsWithoutModel = reactiveOmit(props, 'modelValue')
const comboboxProps = useForwardPropsEmits(comboboxPropsWithoutModel, emits)

const prefix = defineModel<T>({ required: true })
</script>

<template>
  <Combobox v-model="prefix" v-bind="comboboxProps">
    <ComboboxAnchor>
      <InputGroup>
        <InputGroupComboboxInput
          v-bind="{ ...$attrs }"
          :display-value="(prefix: T) => (prefix ? absoluteToPrefixed(prefix) : '')"
          @blur="
            (e: FocusEvent) => {
              const target = e.target as HTMLInputElement
              prefix = prefixedToAbsolute(target.value) as T
              props.onBlur?.(e)
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
