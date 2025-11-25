<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { ScrollAreaRootProps } from 'reka-ui'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import ScrollBar from './scroll-bar.vue'

const props = defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
  >
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="rounded-[inherit] outline-none focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 size-full transition-[color,box-shadow]"
      as-child
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
