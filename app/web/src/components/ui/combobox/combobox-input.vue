<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { ComboboxInputEmits, ComboboxInputProps } from 'reka-ui'
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }
>()

const emits = defineEmits<ComboboxInputEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxInput
    v-bind="{ ...forwarded, ...$attrs }"
    :class="
      cn(
        'flex bg-background-highlighted px-3 py-1 rounded-sm outline-none w-full h-7 text-sm transition-colors',
        'placeholder:text-text-light',
        'selection:bg-background-blue selection:text-branding ',
        'file:bg-transparent file:border-0 file:font-medium file:text-sm',
        'aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        props.class,
      )
    "
  >
    <slot />
  </ComboboxInput>
</template>
