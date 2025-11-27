<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { SelectValueProps } from 'reka-ui'
import { SelectValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<SelectValueProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectValue
    data-slot="select-value"
    v-bind="props"
    :class="cn('[data-placeholder]:text-text-light', props.class)"
  >
    <slot />
  </SelectValue>
</template>
