<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { DropdownMenuItemProps } from 'reka-ui'
import { DropdownMenuItem, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<
    DropdownMenuItemProps & {
      class?: HTMLAttributes['class']
      inset?: boolean
      variant?: 'default' | 'danger'
    }
  >(),
  {
    variant: 'default',
  },
)

const delegatedProps = reactiveOmit(props, 'inset', 'variant', 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex items-center gap-2 px-2 py-1.5 rounded-sm outline-hidden text-sm cursor-default select-none',
        'focus:bg-background-highlighted focus:text-text',
        'data-[variant=danger]:text-danger data-[variant=danger]:focus:bg-danger/10 data-[variant=danger]:focus:text-danger data-[variant=danger]:*:[svg]:text-danger!',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
