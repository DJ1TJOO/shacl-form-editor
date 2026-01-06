<script setup lang="ts">
import { SideBar } from '@/components/side-bar'
import { onMounted, onUnmounted, ref } from 'vue'
import Bar from './bar.vue'
import { injectOptionsSidebarProviderContext } from './provider.vue'

const { isOpen } = injectOptionsSidebarProviderContext()

const height = ref(0)
const observer = new ResizeObserver((entries) => {
  const entry = entries[0]
  if (!entry) return
  height.value = entry.contentRect.height
})

onMounted(() => {
  const target = document.querySelector("[data-slot='router-view']")
  if (!target) return
  observer.observe(target)
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <div
    v-if="isOpen"
    class="right-0 absolute w-[calc(100%-16rem-0.5rem)]"
    :style="{ height: `${height}px` }"
  >
    <SideBar>
      <Bar />
    </SideBar>
  </div>
</template>
