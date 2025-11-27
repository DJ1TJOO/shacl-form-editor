<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="field-label"
    :class="
      cn(
        'flex items-center gap-2 group-data-[disabled=true]/field:opacity-50 w-fit font-medium text-sm leading-snug',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
