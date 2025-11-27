<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="field-separator"
    :data-content="!!$slots.default"
    :class="cn('relative h-4 text-sm', props.class)"
  >
    <Separator class="top-1/2 absolute" />
    <span
      v-if="$slots.default"
      class="block relative bg-background mx-auto px-2 w-fit text-text-light"
      data-slot="field-separator-content"
    >
      <slot />
    </span>
  </div>
</template>
