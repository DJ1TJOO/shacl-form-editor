<script setup lang="ts">
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  InputProps & {
    class?: HTMLAttributes['class']
  }
>()
</script>

<template>
  <Input
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
