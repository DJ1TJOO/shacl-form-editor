<script lang="ts">
import { graph, type IndexedFormula } from 'rdflib'
import { createContext } from 'reka-ui'
import { ref, type Ref } from 'vue'

interface FileContext {
  store: Ref<IndexedFormula>
}

export const [injectFileContext, provideFileContext] = createContext<FileContext>('FileContext')
</script>

<script setup lang="ts">
// @TODO: Test if this assertion is correct
const store = ref(graph()) as Ref<IndexedFormula>

provideFileContext({
  store,
})

defineExpose({
  store,
})
</script>

<template>
  <slot />
</template>
