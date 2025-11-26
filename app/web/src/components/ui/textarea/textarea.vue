<script setup lang="ts">
import type { TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'
import { useVModel } from '@vueuse/core'

const props = defineProps<TextareaProps>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="
      cn(
        'flex bg-background-highlighted shadow-xs px-3 py-2 rounded-sm outline-none w-full min-h-16',
        'md:text-sm text-base placeholder:text-text-light',
        'selection:bg-background-blue selection:text-branding ',
        'transition-[color,box-shadow] field-sizing-content',
        'aria-invalid:border-danger aria-invalid:ring-danger/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        props.class,
      )
    "
  />
</template>
