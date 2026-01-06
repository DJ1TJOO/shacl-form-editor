<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="dropdown-menu-shortcut"
    :class="cn('text-text-light ml-auto text-xs tracking-widest font-mono', props.class)"
  >
    <slot />
  </span>
</template>
