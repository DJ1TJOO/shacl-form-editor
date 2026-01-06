<script setup lang="ts">
import { SideBar } from '@/components/side-bar'
import { useElementVisibleHeight } from '@/composables/use-element-visible-height'
import { computed } from 'vue'
import Bar from './bar.vue'
import { injectOptionsSidebarProviderContext } from './provider.vue'

const { isOpen } = injectOptionsSidebarProviderContext()

const elementsHeight = useElementVisibleHeight([
  '[data-slot="header"]',
  '[data-slot="header-separator"]',
  '[data-slot="editor-bar"]',
])
const topOffset = computed(() => {
  return `calc(${elementsHeight.value}px + var(--spacing))`
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed w-[calc(100%-0.5rem)] h-[calc(100vh-3rem)]"
    data-slot="options-bar"
    :style="{ top: topOffset }"
  >
    <SideBar><Bar /></SideBar>
  </div>
</template>
