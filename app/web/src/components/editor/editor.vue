<script setup lang="ts">
import { ConstraintsList } from '@/components/constraints'
import { EditorBar, NewItemDialog } from '@/components/editor-bar'
import { useFile } from '@/components/file'
import { NamespaceManager, Namespaces, Prefixes } from '@/components/namespace'
import { OptionsBar, OptionsSidebarProvider } from '@/components/options-bar'
import { PropertiesList } from '@/components/properties'
import { Shacl } from '@/components/rdf'
import { HeaderActions } from '@/components/sfe-header'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { scrollToShape, TurtleEditorProvider, TurtleFileEditor } from '@/components/turtle-editor'
import { Button } from '@/components/ui/button'
import { useShapeType } from '@/composables/use-shacl'
import { useUrlSearchParams } from '@vueuse/core'
import {
  ClipboardListIcon,
  CodeIcon,
  DownloadIcon,
  FormIcon,
  LayoutTemplateIcon,
} from 'lucide-vue-next'
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

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

const params = useUrlSearchParams<{ tab: 'editor' | 'turtle' }>('history', {
  initialValue: { tab: 'editor' },
  writeMode: 'replace',
})

const turtleEditorProviderRef = ref<InstanceType<typeof TurtleEditorProvider> | null>(null)

const { store, currentShapeIRI, currentShape, file } = useFile()
const type = useShapeType({ subject: currentShape.node })

const activeNamespaces = Namespaces.useActiveNamespaces()
const namespaces = Namespaces.useActiveNamespacesDefinitions()

async function goToTurtle() {
  params.tab = 'turtle'
  await nextTick()
  if (currentShapeIRI.value && turtleEditorProviderRef.value?.editor) {
    const prefixedShape = Prefixes.absoluteToPrefixed(
      namespaces.value,
      file.value.implicitBase,
      currentShapeIRI.value,
    )
    scrollToShape(prefixedShape, turtleEditorProviderRef.value.editor)
  }
}

const route = useRoute()
const showNewItemDialog = computed(() => !route.params.shapeId && params.tab === 'editor')
</script>

<template>
  <TurtleEditorProvider ref="turtleEditorProviderRef">
    <HeaderActions>
      <div class="@container/editor-header-tab flex lg:justify-center gap-2 max-lg:col-span-2">
        <Button
          :color="params.tab === 'editor' ? 'complementary' : 'background-highlighted'"
          size="lg"
          @click="params.tab = 'editor'"
        >
          <LayoutTemplateIcon />
          <span class="@max-sm/editor-header-tab:hidden">Editor</span>
        </Button>
        <Button
          :color="params.tab === 'turtle' ? 'complementary' : 'background-highlighted'"
          size="lg"
          @click="goToTurtle"
        >
          <CodeIcon />
          <span class="@max-sm/editor-header-tab:hidden">Turtle</span>
        </Button>
        <Button
          color="background-highlighted"
          size="lg"
          disabled
          title="Future feature to test forms generated from the schema"
        >
          <FormIcon />
          <span class="@max-sm/editor-header-tab:hidden">Form</span>
        </Button>
      </div>
      <div class="@container/editor-header-actions flex justify-end gap-2">
        <NamespaceManager v-model:active-namespaces="activeNamespaces">
          <Button size="lg" color="background-highlighted">
            <ClipboardListIcon />
            <span class="@max-sm/editor-header-actions:hidden">Manage Namespaces</span>
          </Button>
        </NamespaceManager>
        <Button
          size="lg"
          @click="Shacl.download(store, namespaces, file.explicitBase ?? file.implicitBase ?? null)"
          title="Log the serialized data to the console, to download edit the downloadTtl function"
        >
          <DownloadIcon />
          <span class="@max-sm/editor-header-actions:hidden">Export Schema</span>
        </Button>
      </div>
    </HeaderActions>

    <NewItemDialog v-model:open="showNewItemDialog" />

    <OptionsSidebarProvider ref="optionsSidebarProviderRef">
      <EditorBar :activeTab="params.tab" />
      <div v-if="params.tab === 'editor'" class="gap-3 grid p-1" :style="{ gridTemplateColumns }">
        <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
          <Shape :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
          <Toolbox
            v-if="type === 'node'"
            :open="isLeftSideBarOpen"
            @update:open="isLeftSideBarOpen = $event"
          />
        </SideBar>
        <PropertiesList v-if="type === 'node'" as="main" />
        <ConstraintsList v-if="type === 'property'" as="main" />
        <OptionsBar />
      </div>
      <main v-else-if="params.tab === 'turtle'" class="bg-background-highlighted p-1">
        <TurtleFileEditor />
      </main>
    </OptionsSidebarProvider>
  </TurtleEditorProvider>
</template>
