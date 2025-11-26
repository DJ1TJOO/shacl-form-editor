<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { CheckIcon } from 'lucide-vue-next'
import type { ComboboxItemIndicatorProps } from 'reka-ui'
import { ComboboxItemIndicator, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ComboboxItemIndicatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxItemIndicator
    data-slot="combobox-item-indicator"
    v-bind="forwarded"
    :class="cn('ml-auto text-branding', props.class)"
  >
    <slot> <CheckIcon class="size-4" /></slot>
  </ComboboxItemIndicator>
</template>
