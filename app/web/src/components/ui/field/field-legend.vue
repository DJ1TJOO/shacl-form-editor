<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: 'legend' | 'label'
}>()
</script>

<template>
  <legend
    data-slot="field-legend"
    :data-variant="variant"
    :class="
      cn(
        'mb-px font-bold text-branding',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        props.class,
      )
    "
  >
    <slot />
  </legend>
</template>
