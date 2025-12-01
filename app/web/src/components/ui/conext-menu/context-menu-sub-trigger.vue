<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import type { ContextMenuSubTriggerProps } from 'reka-ui'
import { ContextMenuSubTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  ContextMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()

const delegatedProps = reactiveOmit(props, 'class', 'inset')
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ContextMenuSubTrigger
    data-slot="context-menu-sub-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        'flex items-center px-2 py-1.5 data-inset:pl-8 rounded-sm outline-hidden text-sm cursor-default select-none',
        'data-[state=open]:bg-background-highlighted data-[state=open]:text-text',
        ' focus:text-text focus:bg-background-highlighted',
        props.class,
      )
    "
  >
    <slot />
    <ChevronRight class="ml-auto size-4" />
  </ContextMenuSubTrigger>
</template>


