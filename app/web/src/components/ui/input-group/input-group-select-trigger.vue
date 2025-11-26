<script setup lang="ts">
import { SelectTrigger } from '@/components/ui/select'
import { cn } from '@/lib/cn'
import type { SelectTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectTrigger
    data-slot="input-group-control"
    :class="
      cn(
        'flex-1 bg-transparent shadow-none border-0 rounded-none focus-visible:ring-0',
        props.class,
      )
    "
    no-icon
  >
    <slot />
  </SelectTrigger>
</template>
