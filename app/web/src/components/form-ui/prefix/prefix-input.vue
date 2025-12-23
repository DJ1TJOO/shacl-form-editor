<script setup lang="ts" generic="T extends string | undefined">
import { useFile } from '@/components/file'
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
import { reactiveOmit } from '@vueuse/core'
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { useFilter, useForwardPropsEmits } from 'reka-ui'
import { computed, ref, type HTMLAttributes, type InputHTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxRootProps & {
    onBlur?: HTMLAttributes['onBlur']
    noSuggestions?: boolean
    types?: readonly [string, ...string[]]
  } & /* @vue-ignore */ InputHTMLAttributes
>()
const emits = defineEmits<ComboboxRootEmits>()

const comboboxPropsWithoutModel = reactiveOmit(props, 'modelValue')
const comboboxProps = useForwardPropsEmits(comboboxPropsWithoutModel, emits)

const prefix = defineModel<T>({ required: true })

const { file } = useFile()
const prefixSuggestions = Prefixes.usePrefixSuggestionsList(props.types)
const namespaces = Namespaces.useActiveNamespacesDefinitions()

const searchTerm = ref('')
const { contains, startsWith } = useFilter({ sensitivity: 'base' })
const filteredPrefixSuggestions = computed(() => {
  const [prefix, iri] = searchTerm.value.split(':')
  return prefixSuggestions.value.filter(
    (p) =>
      (prefix && startsWith(p.label, prefix) && (!iri || contains(p.iri, iri))) ||
      contains(p.iri, searchTerm.value),
  )
})
</script>

<template>
  <Combobox v-model="prefix" v-bind="comboboxProps" ignore-filter>
    <ComboboxAnchor>
      <InputGroup>
        <InputGroupComboboxInput
          v-bind="{ ...$attrs }"
          v-model="searchTerm"
          :display-value="
            (prefix: T) =>
              prefix ? Prefixes.absoluteToPrefixed(namespaces, file.implicitBase, prefix) : ''
          "
          @blur="
            (e: FocusEvent) => {
              const target = e.target as HTMLInputElement
              prefix = Prefixes.prefixedToAbsolute(namespaces, file.implicitBase, target.value) as T
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
        <ComboboxItem
          v-for="option in filteredPrefixSuggestions"
          :key="option.iri"
          :value="option.iri"
        >
          <div class="flex items-center gap-2">
            <ComboboxItemIndicator />
            <span> {{ option.label }}</span>
          </div>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
