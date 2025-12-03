<script setup lang="ts">
import FileItem from '@/components/editor-bar/file-item.vue'
import NewItem from '@/components/editor-bar/new-item.vue'
import ShapeItem from '@/components/editor-bar/shape-item.vue'
import { useShapes } from '@/composables/use-shacl'
import { useRouter } from 'vue-router'

const router = useRouter()
const { shapes, removeShape } = useShapes()
</script>

<template>
  <nav data-slot="editor-bar" class="top-0 sticky flex bg-background w-full h-10 overflow-x-auto">
    <FileItem />
    <ShapeItem
      v-for="shape in shapes"
      :key="shape.value"
      :to="`/file/MyShaclFile/${encodeURIComponent(shape.value)}`"
      :label="shape.name"
      :type="shape.type"
      @removeShape="
        () => {
          removeShape(shape.value)

          const nextShape = shapes[0]
          if (nextShape) {
            router.push(`/file/MyShaclFile/${encodeURIComponent(nextShape.value)}`)
          } else {
            router.push('/file/MyShaclFile/')
          }
        }
      "
    />
    <NewItem />
  </nav>
</template>
