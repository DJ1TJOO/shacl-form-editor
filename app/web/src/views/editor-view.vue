<script setup lang="ts">
import { EditorBar } from '@/components/editor-bar'
import { OptionsBar, OptionsSidebarProvider } from '@/components/options-bar'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { Input } from '@/components/ui/input'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const shape = computed(() => (route.params.shapeId === 'MyProperty' ? 'property' : 'node'))

const isLeftSideBarOpen = ref(true)
const optionsSidebarProviderRef = ref<InstanceType<typeof OptionsSidebarProvider> | null>(null)

const gridTemplateColumns = computed(() => {
  const leftWidth = isLeftSideBarOpen.value ? '16rem' : '44px'
  const rightWidth = isLeftSideBarOpen.value ? '24rem' : 'calc(24rem + 16rem - 44px)'

  const isOptionsSidebarOpen = optionsSidebarProviderRef.value?.isOpen ?? false
  if (isOptionsSidebarOpen) {
    return `${leftWidth} 1fr ${rightWidth}`
  }
  return `${leftWidth} 1fr`
})
</script>

<template>
  <OptionsSidebarProvider ref="optionsSidebarProviderRef">
    <EditorBar />
    <div class="gap-3 grid p-1" :style="{ gridTemplateColumns }">
      <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
        <Shape :open="isLeftSideBarOpen" :shape="shape" @update:open="isLeftSideBarOpen = $event" />
        <Toolbox
          v-if="shape === 'node'"
          :open="isLeftSideBarOpen"
          @update:open="isLeftSideBarOpen = $event"
        />
      </SideBar>
      <main class="space-y-3">
        <div class="bg-background mx-auto p-2 rounded-lg max-w-md h-40" data-activatable>
          <Input />
        </div>
        <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
        <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
        <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
        <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
        <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      </main>
      <OptionsBar />
    </div>
  </OptionsSidebarProvider>
</template>
