<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="field-group"
    :class="
      cn(
        '@container/field-group group/field-group flex flex-col gap-2 w-full',
        'data-[slot=checkbox-group]:gap-1',
        '*:data-[slot=field-group]:gap-1.5',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
