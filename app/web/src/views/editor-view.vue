<script setup lang="ts">
import { EditorBar, NewItemDialog } from '@/components/editor-bar'
import { Namespaces, Prefixes } from '@/components/namespace'
import { OptionsBar, OptionsSidebarProvider } from '@/components/options-bar'
import { PropertiesList } from '@/components/properties'
import { FileProvider, Shacl } from '@/components/rdf'
import { HeaderActions } from '@/components/sfe-header'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { scrollToShape, TurtleEditorProvider, TurtleFileEditor } from '@/components/turtle-editor'
import { Button } from '@/components/ui/button'
import { useUrlSearchParams } from '@vueuse/core'
import { CodeIcon, DownloadIcon, FormIcon, LayoutTemplateIcon } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const params = useUrlSearchParams<{ tab: 'editor' | 'turtle' }>('history', {
  initialValue: { tab: 'editor' },
  writeMode: 'replace',
})

const route = useRoute()
const shapeIRI = computed(() =>
  typeof route.params.shapeId === 'string' ? decodeURIComponent(route.params.shapeId) : undefined,
)

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

const fileProviderRef = ref<InstanceType<typeof FileProvider> | null>(null)
const store = computed(() => fileProviderRef.value?.store)
const turtleEditorProviderRef = ref<InstanceType<typeof TurtleEditorProvider> | null>(null)
const showNewItemDialog = ref(false)
watch(
  () => fileProviderRef.value?.showNewItemDialog,
  (showNewItemDialogFileProvider) => {
    showNewItemDialog.value = showNewItemDialogFileProvider ?? false
  },
  { immediate: true },
)

const shapeExists = ref(false)
watch(
  () => [shapeIRI.value, store.value] as const,
  ([shapeIRI, store]) => {
    if (!store) return false
    shapeExists.value = shapeIRI ? Shacl.shapeExists(store, shapeIRI) : false
  },
  { immediate: true },
)

const downloadTtl = (debug: boolean = false) => {
  if (!store.value) return

  const serialized = Shacl.serialize(store.value, namespaces.value)
  if (!serialized) return

  if (debug) {
    console.log(serialized)
    return
  }

  const blob = new Blob([serialized], { type: 'text/turtle;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'data.ttl'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const namespaces = Namespaces.useActiveNamespacesDefinitions(store)
async function goToTurtle() {
  params.tab = 'turtle'
  await nextTick()
  if (shapeIRI.value && turtleEditorProviderRef.value?.editor) {
    const prefixedShape = Prefixes.absoluteToPrefixed(namespaces.value, shapeIRI.value)
    scrollToShape(prefixedShape, turtleEditorProviderRef.value.editor)
  }
}
</script>

<template>
  <TurtleEditorProvider ref="turtleEditorProviderRef">
    <FileProvider ref="fileProviderRef">
      <HeaderActions>
        <div class="flex gap-2">
          <Button
            :color="params.tab === 'editor' ? 'complementary' : 'background-highlighted'"
            size="lg"
            @click="params.tab = 'editor'"
          >
            <LayoutTemplateIcon />
            Editor
          </Button>
          <Button
            :color="params.tab === 'turtle' ? 'complementary' : 'background-highlighted'"
            size="lg"
            @click="goToTurtle"
          >
            <CodeIcon />
            Turtle
          </Button>
          <Button
            color="background-highlighted"
            size="lg"
            disabled
            title="Future feature to test forms generated from the schema"
          >
            <FormIcon />
            Form
          </Button>
        </div>
        <div class="flex gap-2">
          <Button
            size="lg"
            @click="downloadTtl"
            title="Log the serialized data to the console, to download edit the downloadTtl function"
          >
            <DownloadIcon />
            Export Schema
          </Button>
        </div>
      </HeaderActions>

      <NewItemDialog v-model:open="showNewItemDialog" />

      <OptionsSidebarProvider ref="optionsSidebarProviderRef">
        <EditorBar :activeTab="params.tab" />
        <div
          :key="shapeIRI"
          v-if="shapeExists && params.tab === 'editor'"
          class="gap-3 grid p-1"
          :style="{ gridTemplateColumns }"
        >
          <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
            <Shape :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
            <Toolbox :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
          </SideBar>
          <PropertiesList as="main" />
          <OptionsBar />
        </div>
        <main v-else-if="params.tab === 'turtle'" class="bg-background-highlighted p-1">
          <TurtleFileEditor />
        </main>
      </OptionsSidebarProvider>
    </FileProvider>
  </TurtleEditorProvider>
</template>
