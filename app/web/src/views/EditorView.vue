<script setup lang="ts">
import {
  AdditionalConstraints,
  CardinalityConstraints,
  PairConstraints,
  RangeConstraints,
  ShapeConstraints,
  StringConstraints,
  TargetConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { EditorBar } from '@/components/editor-bar'
import { Shape } from '@/components/shape'
import { SideBar, SideBarTitle } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { FieldSeparator } from '@/components/ui/field'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const shape = computed(() => (route.params.shapeId === 'MyProperty' ? 'property' : 'node'))

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
</script>

<template>
  <EditorBar />
  <main class="gap-3 grid p-1" :style="{ gridTemplateColumns }">
    <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
      <Shape :open="isLeftSideBarOpen" :shape="shape" @update:open="isLeftSideBarOpen = $event" />
      <Toolbox
        v-if="shape === 'node'"
        :open="isLeftSideBarOpen"
        @update:open="isLeftSideBarOpen = $event"
      />
    </SideBar>
    <div class="space-y-3">
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
    </div>
    <SideBar
      v-if="isRightSideBarOpen"
      child-class="space-y-2 bg-background p-2 rounded-lg min-h-full"
    >
      <SideBarTitle>Options of MyNode</SideBarTitle>
      <CardinalityConstraints />
      <FieldSeparator />
      <TypeConstraints collapsible />
      <FieldSeparator />
      <PairConstraints collapsible />
      <FieldSeparator />
      <ValueConstraints collapsible />
      <FieldSeparator />
      <RangeConstraints collapsible />
      <FieldSeparator />
      <StringConstraints collapsible />
      <FieldSeparator />
      <ShapeConstraints collapsible />
      <FieldSeparator />
      <ValidationConstraints collapsible />
      <FieldSeparator />
      <AdditionalConstraints />
      <FieldSeparator />
      <TargetConstraints collapsible />
    </SideBar>
  </main>
</template>
