<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { ClassValue } from 'clsx'
import { computed } from 'vue'

const props = defineProps<{
  active?: boolean
  class?: ClassValue
}>()

const classes = computed(() =>
  cn(
    'flex items-center gap-2 hover:bg-background-highlighted px-3 border-y-2 border-y-transparent h-full text-text transition-colors cursor-default',
    props.active && 'border-b-branding',
    props.class,
  ),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
