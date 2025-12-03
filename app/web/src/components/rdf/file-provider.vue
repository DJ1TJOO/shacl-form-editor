<script lang="ts">
import { useParentlessNamedNode } from '@/composables/use-shacl'
import { graph, type IndexedFormula } from 'rdflib'
import { createContext } from 'reka-ui'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface FileContext {
  store: Ref<IndexedFormula>
  currentShape: ReturnType<typeof useParentlessNamedNode>
}

export const [injectFileContext, provideFileContext] = createContext<FileContext>('File')
</script>

<script setup lang="ts">
// @TODO: Test if this assertion is correct
const store = ref(graph()) as Ref<IndexedFormula>

const route = useRoute()
const router = useRouter()
const shapeIRI = computed(() => {
  if (typeof route.params.shapeId !== 'string') return undefined
  const shapeId = decodeURIComponent(route.params.shapeId)
  if (!shapeId.includes(':')) return undefined
  return shapeId
})
const shape = useParentlessNamedNode({ initialValue: shapeIRI })

watch(shape.value, (iri) => {
  if (!iri) return

  const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
  router.replace(`/file/${fileId}/${encodeURIComponent(iri)}`)
})

provideFileContext({
  store,
  currentShape: shape,
})

defineExpose({
  store,
})
</script>

<template>
  <slot />
</template>
