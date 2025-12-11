<script setup lang="ts">
import { injectFileContext } from '@/components/rdf'
import { TurtleEditor } from '@/components/turtle-editor'

const { storedStore } = injectFileContext()
</script>

<template>
  <TurtleEditor v-model="storedStore" />
</template>
