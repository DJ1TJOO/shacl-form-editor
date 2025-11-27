<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import type { SelectTriggerProps } from 'reka-ui'
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes['class']; noIcon?: boolean }
>()

const delegatedProps = reactiveOmit(props, 'class', 'noIcon')
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        'flex justify-between items-center gap-2 bg-background-highlighted shadow-xs px-3 py-2 rounded-sm w-fit h-7 text-sm whitespace-nowrap',
        'transition-[color,box-shadow] outline-none',
        'aria-invalid:ring-danger/20 aria-invalid:border-danger',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-placeholder:text-text-light',
        '[&_svg]:text-text-light',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        props.class,
      )
    "
  >
    <slot />
    <slot name="icon" v-if="!noIcon">
      <SelectIcon as-child>
        <ChevronDown />
      </SelectIcon>
    </slot>
  </SelectTrigger>
</template>
