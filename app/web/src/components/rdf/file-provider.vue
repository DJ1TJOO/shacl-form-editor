<script lang="ts">
import { Namespaces } from '@/components/namespace'
import { Shacl } from '@/components/rdf'
import { useGlobalName } from '@/composables/use-shacl'
import { useStorage, watchIgnorable } from '@vueuse/core'
import { graph, NamedNode, type IndexedFormula } from 'rdflib'
import { createContext } from 'reka-ui'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tryCatch } from '../../lib/try-catch'

interface FileContext {
  store: Ref<IndexedFormula>
  resetFile: () => void
  currentShape: ReturnType<typeof useGlobalName>
  showNewItemDialog: Ref<boolean>
  storedStore: Ref<string | null>
  isStoredStoreInvalid: Ref<string | null>
}

export const [injectFileContext, provideFileContext] = createContext<FileContext>('File')
</script>

<script setup lang="ts">
const store = ref(graph()) as Ref<IndexedFormula>
const storedStore = useStorage<string | null>('file-store', null)
const isStoreLoaded = ref(false)
const isStoredStoreInvalid = ref<string | null>(null)
const showNewItemDialog = ref(false)

function watchStore(store: IndexedFormula) {
  store.addDataCallback(() => {
    ignoreStoredStoreUpdates(() => {
      storedStore.value = Shacl.serialize(store)
    })
  })
  store.addDataRemovalCallback(() => {
    ignoreStoredStoreUpdates(() => {
      storedStore.value = Shacl.serialize(store)
    })
  })
}

const { ignoreUpdates: ignoreStoredStoreUpdates } = watchIgnorable(
  storedStore,
  (newStoredStore) => {
    if (!newStoredStore) return

    const [error, newStore] = tryCatch(Shacl.deserialize, newStoredStore)
    if (error) {
      isStoredStoreInvalid.value = error.message
      return
    }

    watchStore(newStore)
    store.value = newStore
    isStoreLoaded.value = true
    isStoredStoreInvalid.value = null
  },
  { immediate: true },
)

function resetFile() {
  const newStore = graph()
  watchStore(newStore)
  store.value = newStore
  ignoreStoredStoreUpdates(() => {
    storedStore.value = Shacl.serialize(newStore)
  })
}

watchStore(store.value)

const route = useRoute()
const router = useRouter()
const shapeIRI = computed(() => {
  if (typeof route.params.shapeId !== 'string') return undefined
  const shapeId = decodeURIComponent(route.params.shapeId)
  if (!shapeId.includes(':')) return undefined
  return shapeId
})
const shape = useGlobalName({ initialValue: shapeIRI, store })

watch(shape.value, (iri) => {
  if (!iri) return

  const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
  router.replace(`/file/${fileId}/${encodeURIComponent(iri)}`)
})

watch(
  [isStoreLoaded, store, shapeIRI],
  () => {
    if (!isStoreLoaded.value) return

    const currentStore = store.value
    const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
    const currentPath = route.path

    if (shapeIRI.value && Shacl.shapeExists(currentStore, shapeIRI.value)) {
      shape.node.value = new NamedNode(shapeIRI.value)
      const targetPath = `/file/${fileId}/${encodeURIComponent(shapeIRI.value)}`
      if (currentPath !== targetPath) {
        router.replace(targetPath)
      }
      showNewItemDialog.value = false
      return
    }

    const allShapes = Shacl.getAllShapes(currentStore)

    const firstShape = allShapes[0]
    if (firstShape) {
      shape.node.value = new NamedNode(firstShape.value)
      const targetPath = `/file/${fileId}/${encodeURIComponent(firstShape.value)}`
      if (currentPath !== targetPath) {
        router.replace(targetPath)
      }
      showNewItemDialog.value = false
      return
    }

    shape.node.value = undefined
    const targetPath = `/file/${fileId}/`
    if (currentPath !== targetPath) {
      router.replace(targetPath)
    }
    showNewItemDialog.value = true
  },
  { immediate: true },
)

Namespaces.usePrefixSuggestionsForActiveNamespaces()

provideFileContext({
  store,
  currentShape: shape,
  resetFile,
  showNewItemDialog,
  storedStore,
  isStoredStoreInvalid,
})

defineExpose({
  store,
  showNewItemDialog,
})
</script>

<template>
  <slot />
</template>
