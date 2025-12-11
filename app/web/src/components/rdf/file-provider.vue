<script lang="ts">
import { Shacl } from '@/components/rdf'
import { useParentlessNamedNode } from '@/composables/use-shacl'
import { useStorage, watchIgnorable } from '@vueuse/core'
import { graph, type IndexedFormula } from 'rdflib'
import { createContext } from 'reka-ui'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { tryCatch } from '../../lib/try-catch'

interface FileContext {
  store: Ref<IndexedFormula>
  resetFile: () => void
  currentShape: ReturnType<typeof useParentlessNamedNode>
  showNewItemDialog: Ref<boolean>
  storedStore: Ref<string | null>
  isStoredStoreValid: Ref<boolean>
}

export const [injectFileContext, provideFileContext] = createContext<FileContext>('File')
</script>

<script setup lang="ts">
const store = ref(graph()) as Ref<IndexedFormula>
const storedStore = useStorage<string | null>('file-store', null)
const isStoreLoaded = ref(false)
const isStoredStoreValid = ref(true)
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
      isStoredStoreValid.value = false
      toast.error('Failed to load file', {
        description: error.message,
      })
      return
    }

    watchStore(newStore)
    store.value = newStore
    isStoreLoaded.value = true
    if (!isStoredStoreValid.value) {
      isStoredStoreValid.value = true
      toast.success('File loaded successfully')
    }
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
const shape = useParentlessNamedNode({ initialValue: shapeIRI })

watch(
  [isStoreLoaded, store, shapeIRI],
  () => {
    if (!isStoreLoaded.value) return

    const currentStore = store.value
    const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
    const currentPath = route.path

    if (shapeIRI.value && Shacl.shapeExists(currentStore, shapeIRI.value)) {
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
      const targetPath = `/file/${fileId}/${encodeURIComponent(firstShape.value)}`
      if (currentPath !== targetPath) {
        router.replace(targetPath)
      }
      showNewItemDialog.value = false
      return
    }

    const targetPath = `/file/${fileId}/`
    if (currentPath !== targetPath) {
      router.replace(targetPath)
    }
    showNewItemDialog.value = true
  },
  { immediate: true },
)

watch(shape.value, (iri) => {
  if (!iri) return

  const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
  router.replace(`/file/${fileId}/${encodeURIComponent(iri)}`)
})

provideFileContext({
  store,
  currentShape: shape,
  resetFile,
  showNewItemDialog,
  storedStore,
  isStoredStoreValid,
})

defineExpose({
  store,
  showNewItemDialog,
})
</script>

<template>
  <slot />
</template>
