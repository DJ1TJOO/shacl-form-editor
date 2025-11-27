<script setup lang="ts">
import { Textarea, type TextareaEmits, type TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  TextareaProps & {
    class?: HTMLAttributes['class']
  }
>()

const emits = defineEmits<TextareaEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Textarea
    v-bind="{ ...forwarded, ...$attrs }"
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
