<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { ScrollAreaScrollbarProps } from 'reka-ui'
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<
    ScrollAreaScrollbarProps & { class?: HTMLAttributes['class']; size?: number; offset?: number }
  >(),
  {
    orientation: 'vertical',
    size: 2.5,
    offset: 0,
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'size')
</script>

<template>
  <ScrollAreaScrollbar
    data-slot="scroll-area-scrollbar"
    v-bind="delegatedProps"
    :class="
      cn(
        'flex p-px transition-colors touch-none select-none',
        orientation === 'vertical' && `h-full border-l border-l-transparent`,
        orientation === 'horizontal' && `flex-col border-t border-t-transparent`,
        props.class,
      )
    "
    :style="{
      width: orientation === 'vertical' ? `calc(var(--spacing)*${props.size})` : undefined,
      height: orientation === 'horizontal' ? `calc(var(--spacing)*${props.size})` : undefined,
      bottom: orientation === 'horizontal' ? `calc(var(--spacing)*${props.offset})` : 0,
      right: orientation === 'vertical' ? `calc(var(--spacing)*${props.offset})` : 0,
    }"
  >
    <ScrollAreaThumb
      data-slot="scroll-area-thumb"
      class="relative flex-1 bg-separator rounded-full"
    />
  </ScrollAreaScrollbar>
</template>
