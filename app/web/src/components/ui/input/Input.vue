<script setup lang="ts">
import type { InputEmits, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<InputProps>()

const emits = defineEmits<InputEmits>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ inputRef })
</script>

<template>
  <input
    ref="inputRef"
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'flex bg-background-highlighted shadow-xs px-3 py-1 rounded-sm outline-none w-full min-w-0 h-7 md:text-sm text-base transition-[color,box-shadow]',
        'placeholder:text-text-light',
        'selection:bg-background-blue selection:text-branding ',
        'file:border-0 file:inline-flex file:bg-transparent file:font-medium file:text-text file:text-sm file:h-7',
        'aria-invalid:ring-danger/20 aria-invalid:border-danger',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        props.class,
      )
    "
  />
</template>
