<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { Check } from 'lucide-vue-next'
import type { SelectItemProps } from 'reka-ui'
import { SelectItem, SelectItemIndicator, SelectItemText, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectItem
    data-slot="select-item"
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex items-center gap-2 py-1.5 pr-8 pl-2 rounded-sm outline-hidden w-full text-sm cursor-default select-none',
        'focus:bg-background-highlighted focus:text-text',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        `[&_svg:not([class*='text-'])]:text-text-lighter`,
        `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        props.class,
      )
    "
  >
    <SelectItemIndicator>
      <slot name="indicator-icon">
        <Check class="size-4 text-branding" />
      </slot>
    </SelectItemIndicator>

    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
