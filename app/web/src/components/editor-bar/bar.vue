<script setup lang="ts">
import FileItem from '@/components/editor-bar/file-item.vue'
import NewItem from '@/components/editor-bar/new-item.vue'
import ShapeItem from '@/components/editor-bar/shape-item.vue'
</script>

<template>
  <div class="flex bg-background w-full">
    <FileItem />
    <ShapeItem to="/file/MyShaclFile/MyNode" label="MyNode" type="node" />
    <ShapeItem to="/file/MyShaclFile/MyProperty" label="MyProperty" type="property" />
    <NewItem />
  </div>
</template>
