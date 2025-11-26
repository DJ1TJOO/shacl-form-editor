<script setup lang="ts">
import { Textarea, type TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  TextareaProps & {
    class?: HTMLAttributes['class']
  }
>()
</script>

<template>
  <Textarea
    data-slot="input-group-control"
    :class="
      cn(
        'flex-1 bg-transparent shadow-none py-3 border-0 rounded-none resize-none',
        'focus-visible:ring-0',
        props.class,
      )
    "
  />
</template>
