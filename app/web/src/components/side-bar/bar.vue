<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/cn'
import { useScroll } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  childClass?: HTMLAttributes['class']
}>()

const layoutHeight = ref(0)

const scrollAreaHeight = computed(() => {
  return layoutHeight.value > 0
    ? `calc(100vh - ${layoutHeight.value}px - 0.5rem)`
    : 'calc(100vh - 0.5rem)'
})

const { y: scrollY } = useScroll(window)

function getIntersectionHeight(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const top = Math.max(0, rect.top)
  const bottom = Math.min(window.innerHeight, rect.bottom)
  return top < bottom ? bottom - top : 0
}

function updateLayoutHeight() {
  const elements = [
    '[data-slot="header"]',
    '[data-slot="header-separator"]',
    '[data-slot="editor-bar"]',
    '[data-slot="footer"]',
    '[data-slot="footer-separator"]',
  ] as const

  let height = 0
  for (const element of elements) {
    const el = document.querySelector<HTMLElement>(element)
    if (el) height += getIntersectionHeight(el)
  }

  layoutHeight.value = height
}

watch(scrollY, updateLayoutHeight)
onMounted(updateLayoutHeight)
</script>

<template>
  <div class="top-11 sticky h-fit">
    <ScrollArea class="rounded-lg" :style="{ height: scrollAreaHeight }">
      <div :class="cn('gap-1 flex flex-col', props.childClass)">
        <slot />
      </div>
    </ScrollArea>
  </div>
</template>
