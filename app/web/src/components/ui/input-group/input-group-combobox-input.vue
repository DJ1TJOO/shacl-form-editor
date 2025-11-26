<script setup lang="ts">
import { ComboboxInput } from '@/components/ui/combobox'
import { cn } from '@/lib/cn'
import type { ComboboxInputProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }
>()
</script>

<template>
  <ComboboxInput
    data-slot="input-group-control"
    :class="
      cn(
        'flex-1 bg-transparent shadow-none border-0 rounded-none',
        'focus-visible:ring-0',
        props.class,
      )
    "
  />
</template>
