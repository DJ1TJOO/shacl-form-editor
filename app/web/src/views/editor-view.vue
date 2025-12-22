<script setup lang="ts">
import { Editor } from '@/components/editor'
import { FileProvider } from '@/components/file'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <FileProvider>
    <Editor :key="typeof route.params.shapeId === 'string' ? route.params.shapeId : undefined" />
  </FileProvider>
</template>
