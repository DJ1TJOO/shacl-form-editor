<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { Circle } from 'lucide-vue-next'
import type { ContextMenuRadioItemEmits, ContextMenuRadioItemProps } from 'reka-ui'
import { ContextMenuItemIndicator, ContextMenuRadioItem, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ContextMenuRadioItemProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<ContextMenuRadioItemEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ContextMenuRadioItem
    data-slot="context-menu-radio-item"
    v-bind="forwarded"
    :class="
      cn(
        `focus:bg-background-highlighted focus:text-text relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
        props.class,
      )
    "
  >
    <span class="left-2 absolute flex justify-center items-center size-3.5 pointer-events-none">
      <ContextMenuItemIndicator>
        <slot name="indicator-icon">
          <Circle class="fill-current size-2 text-branding" />
        </slot>
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuRadioItem>
</template>
