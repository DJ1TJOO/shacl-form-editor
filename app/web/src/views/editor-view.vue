<script setup lang="ts">
import { EditorBar, NewItemDialog } from '@/components/editor-bar'
import { OptionsBar, OptionsSidebarProvider } from '@/components/options-bar'
import { PreviewDialog } from '@/components/preview'
import { PropertiesList } from '@/components/properties'
import { FileProvider, RDF, Shacl } from '@/components/rdf'
import { HeaderActions } from '@/components/sfe-header'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { Button } from '@/components/ui/button'
import { DownloadIcon, EyeIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
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
const shapeExists = ref(false)
watch(
  shapeIRI,
  (iri) => {
    const store = fileProviderRef.value?.store

    let value = false
    if (iri && iri.includes(':') && store) {
      value = store
        .each(new NamedNode(iri), RDF('type'))
        .some(
          (type) =>
            type instanceof NamedNode &&
            (type.equals(Shacl.SHACL('NodeShape')) || type.equals(Shacl.SHACL('PropertyShape'))),
        )
    }

    shapeExists.value = value
    if (!value && route.path !== '/file/MyShaclFile') {
      router.replace(`/file/MyShaclFile/`)
    }
  },
  { immediate: true },
)

const downloadTtl = (debug: boolean = false) => {
  const store = fileProviderRef.value?.store
  if (!store) return

  const serialized = Shacl.serialize(store)
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

const previewOpen = ref(false)
</script>

<template>
  <FileProvider ref="fileProviderRef">
    <HeaderActions>
      <Button color="background-highlighted" size="lg" @click="previewOpen = true">
        <EyeIcon />
        Preview
      </Button>
      <Button
        size="lg"
        @click="() => downloadTtl(true)"
        title="Log the serialized data to the console, to download edit the downloadTtl function"
      >
        <DownloadIcon />
        Export Schema
      </Button>
    </HeaderActions>
    <PreviewDialog v-model:open="previewOpen" />
    <OptionsSidebarProvider ref="optionsSidebarProviderRef">
      <EditorBar />
      <div
        v-if="shapeExists"
        :key="shapeIRI"
        class="gap-3 grid p-1"
        :style="{ gridTemplateColumns }"
      >
        <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
          <Shape :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
          <Toolbox :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
        </SideBar>
        <PropertiesList as="main">
          <!-- <Group label="Name">
            <Property :icon="TypeIcon" label="Text Field" path="firstName" in-group>
              <template #options>
                <Input v-model="value" />
              </template>

              <Input v-model="value" />
            </Property>
            <Property :icon="TypeIcon" label="Text Field" path="lastName" in-group>
              hoi
              <template #options>
                <ExampleFormElements />
              </template>
            </Property>
          </Group>
          <Property :icon="TypeIcon" label="Text Field" path="email">
            hoi
            <template #options> doei </template>
          </Property>
          <Property :icon="TypeIcon" label="Text Field" path="other path">
            hoi
            <template #options> doei </template>
          </Property> -->
        </PropertiesList>
        <OptionsBar />
      </div>
      <div v-else>
        <NewItemDialog default-open />
      </div>
    </OptionsSidebarProvider>
  </FileProvider>
</template>
