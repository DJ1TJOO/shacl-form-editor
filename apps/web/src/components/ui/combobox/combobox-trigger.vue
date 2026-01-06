<script setup lang="ts">
import { cn } from '@/lib/cn'
import { ChevronsUpDownIcon } from 'lucide-vue-next'
import { ComboboxTrigger, type ComboboxTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ComboboxTrigger :class="cn(`[&_svg:not([class*='text-'])]:text-text-lighter`, props.class)">
    <slot>
      <ChevronsUpDownIcon class="size-4" />
    </slot>
  </ComboboxTrigger>
</template>
