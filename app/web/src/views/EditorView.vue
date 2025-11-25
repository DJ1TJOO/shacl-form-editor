<script setup lang="ts">
import { EditorBar } from '@/components/editor-bar'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { computed, ref } from 'vue'

const isLeftSideBarOpen = ref(true)
const isRightSideBarOpen = ref(true)

const gridTemplateColumns = computed(() => {
  const leftWidth = isLeftSideBarOpen.value ? '16rem' : '44px'
  const rightWidth = isLeftSideBarOpen.value ? '24rem' : 'calc(24rem + 16rem - 44px)'

  if (isRightSideBarOpen.value) {
    return `${leftWidth} 1fr ${rightWidth}`
  }
  return `${leftWidth} 1fr`
})

console.log(gridTemplateColumns.value)
</script>

<template>
  <EditorBar />
  <main class="grid p-1" :style="{ gridTemplateColumns }">
    <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
      <Shape :open="isLeftSideBarOpen" shape="node" @update:open="isLeftSideBarOpen = $event" />
      <Toolbox :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
    </SideBar>
    <div class="space-y-3">
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
    </div>
    <SideBar v-if="isRightSideBarOpen">
      <div class="bg-background rounded-lg h-screen">
        some text
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        some text
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        some text
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        some text
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        some text
        <br />
        <br />
        <br />
        <br />
        <br />
        some text
      </div>
    </SideBar>
  </main>
</template>
