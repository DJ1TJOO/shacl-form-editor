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
        'flex items-center gap-1 mb-px font-bold text-branding',
        `[&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4`,
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        props.class,
      )
    "
  >
    <slot />
  </legend>
</template>
