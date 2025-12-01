<script setup lang="ts">
import FileItem from '@/components/editor-bar/file-item.vue'
import NewItem from '@/components/editor-bar/new-item.vue'
import ShapeItem from '@/components/editor-bar/shape-item.vue'
import { injectFileContext, Shacl } from '@/components/rdf'
import { computed } from 'vue'

const { store } = injectFileContext()
const shapes = computed(() => (store.value ? Shacl.findShapes(store.value) : []))
</script>

<template>
  <nav data-slot="editor-bar" class="top-0 sticky flex bg-background w-full h-10 overflow-x-auto">
    <FileItem />
    <ShapeItem
      v-for="shape in shapes"
      :key="shape.name"
      :to="`/file/MyShaclFile/${shape.name}`"
      :label="shape.name"
      :type="shape.type"
      @removeShape="() => Shacl.removeShape(store, shape.node)"
    />
    <NewItem />
  </nav>
</template>
