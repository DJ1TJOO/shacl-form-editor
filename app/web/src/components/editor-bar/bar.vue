<script setup lang="ts">
import FileItem from '@/components/editor-bar/file-item.vue'
import NewItem from '@/components/editor-bar/new-item.vue'
import ShapeItem from '@/components/editor-bar/shape-item.vue'
import { useFile } from '@/components/file'
import { Namespaces, Prefixes } from '@/components/namespace'
import { injectTurtleEditorContext } from '@/components/turtle-editor'
import { useShapes } from '@/composables/use-shacl'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  activeTab: 'editor' | 'turtle'
}>()

const router = useRouter()
const route = useRoute()
const { shapes, removeShape } = useShapes()
const { scrollToShape } = injectTurtleEditorContext()

const { fileId, file } = useFile()
const namespaces = Namespaces.useActiveNamespacesDefinitions()
</script>

<template>
  <nav
    data-slot="editor-bar"
    class="top-0 z-10 sticky flex bg-background w-full h-10 overflow-x-auto"
  >
    <FileItem />
    <ShapeItem
      v-for="shape in shapes"
      :key="shape.value"
      :to="`/file/${fileId}/${encodeURIComponent(shape.value)}`"
      @click="
        () => {
          router.replace(`/file/${fileId}/${encodeURIComponent(shape.value)}`)
          if (activeTab !== 'turtle') return

          const prefixedShape = Prefixes.absoluteToPrefixed(
            namespaces,
            file.implicitBase,
            shape.value,
          )
          scrollToShape(prefixedShape)
        }
      "
      :label="shape.name"
      :type="shape.type"
      @removeShape="
        () => {
          removeShape(shape.value)
          if (!route.path.includes(encodeURIComponent(shape.value))) return

          const nextShape = shapes[0]
          if (nextShape) {
            router.push(`/file/${fileId}/${encodeURIComponent(nextShape.value)}`)
          } else {
            router.push(`/file/${fileId}/`)
          }
        }
      "
    />
    <NewItem />
  </nav>
</template>
