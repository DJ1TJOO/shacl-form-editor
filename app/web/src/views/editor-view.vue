<script setup lang="ts">
import { EditorBar } from '@/components/editor-bar'
import { OptionsBar, OptionsSidebarProvider } from '@/components/options-bar'
import { Group, PropertiesList, Property } from '@/components/properties'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { Input } from '@/components/ui/input'
import { TypeIcon } from 'lucide-vue-next'
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

const value = ref('')
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
      <PropertiesList as="main">
        <Group label="Name">
          <Property :icon="TypeIcon" label="Text Field" path="firstName" in-group>
            <template #options>
              <Input v-model="value" />
            </template>

            <Input v-model="value" />
          </Property>
          <Property :icon="TypeIcon" label="Text Field" path="lastName" in-group>
            hoi
            <template #options> doei </template>
          </Property>
        </Group>
        <Property :icon="TypeIcon" label="Text Field" path="email">
          hoi
          <template #options> doei </template>
        </Property>
        <Property :icon="TypeIcon" label="Text Field" path="other path">
          hoi
          <template #options> doei </template>
        </Property>
      </PropertiesList>
      <OptionsBar />
    </div>
  </OptionsSidebarProvider>
</template>
