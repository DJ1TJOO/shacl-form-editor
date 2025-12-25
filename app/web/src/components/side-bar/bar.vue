<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { useElementVisibleHeight } from '@/composables/use-element-visible-height'
import { cn } from '@/lib/cn'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  disableScroll?: boolean
}>()

const elementsHeight = useElementVisibleHeight([
  '[data-slot="header"]',
  '[data-slot="header-separator"]',
  '[data-slot="editor-bar"]',
  '[data-slot="footer"]',
  '[data-slot="footer-separator"]',
])
const scrollAreaHeight = computed(() => {
  return elementsHeight.value > 0
    ? `calc(100vh - ${elementsHeight.value}px - 0.5rem)`
    : 'calc(100vh - 0.5rem)'
})
</script>

<template>
  <aside :class="cn('md:top-11 md:sticky h-fit', props.class)">
    <slot v-if="props.disableScroll" />
    <ScrollArea v-else class="rounded-lg" :style="{ height: scrollAreaHeight }">
      <slot />
    </ScrollArea>
  </aside>
</template>
