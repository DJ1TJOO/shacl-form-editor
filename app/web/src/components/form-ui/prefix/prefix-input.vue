<script setup lang="ts" generic="T extends string | undefined">
import { Namespaces, Prefixes } from '@/components/namespace'
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
import { useFileStore } from '@/composables/use-shacl'
import { reactiveOmit } from '@vueuse/core'
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import { type HTMLAttributes, type InputHTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxRootProps & {
    onBlur?: HTMLAttributes['onBlur']
    noSuggestions?: boolean
  } & /* @vue-ignore */ InputHTMLAttributes
>()
const emits = defineEmits<ComboboxRootEmits>()

const comboboxPropsWithoutModel = reactiveOmit(props, 'modelValue')
const comboboxProps = useForwardPropsEmits(comboboxPropsWithoutModel, emits)

const prefix = defineModel<T>({ required: true })

const store = useFileStore()
const prefixSuggestions = Prefixes.usePrefixSuggestionsList(store)
const namespaces = Namespaces.useActiveNamespacesDefinitions(store)
</script>

<template>
  <Combobox v-model="prefix" v-bind="comboboxProps">
    <ComboboxAnchor>
      <InputGroup>
        <InputGroupComboboxInput
          v-bind="{ ...$attrs }"
          :display-value="
            (prefix: T) => (prefix ? Prefixes.absoluteToPrefixed(namespaces, prefix) : '')
          "
          @blur="
            (e: FocusEvent) => {
              const target = e.target as HTMLInputElement
              prefix = Prefixes.prefixedToAbsolute(namespaces, target.value) as T
              props.onBlur?.(e)
            }
          "
        />
        <InputGroupAddon align="inline-end">
          <ComboboxTrigger v-if="!noSuggestions" />
          <slot />
        </InputGroupAddon>
      </InputGroup>
    </ComboboxAnchor>

    <ComboboxList hide-when-empty>
      <ComboboxGroup v-if="!noSuggestions">
        <ComboboxItem v-for="option in prefixSuggestions" :key="option.iri" :value="option.iri">
          <div class="flex items-center gap-2">
            <ComboboxItemIndicator />
            <span> {{ option.label }}</span>
          </div>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
