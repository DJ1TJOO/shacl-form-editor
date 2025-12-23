<script lang="ts">
import { Files } from '@/components/file'
import { Namespaces } from '@/components/namespace'
import { Shacl } from '@/components/rdf'
import { useGlobalNamed } from '@/composables/use-shacl'
import { tryCatch } from '@/lib/try-catch'
import { useStorage, watchIgnorable } from '@vueuse/core'
import { graph, IndexedFormula, NamedNode } from 'rdflib'
import { createContext } from 'reka-ui'
import { computed, readonly, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface FileContext {
  fileId: ComputedRef<string>
  fileInStorage: Ref<string>
  file: ComputedRef<Files.File>

  store: Ref<IndexedFormula>
  deserializationError: Readonly<Ref<string | null, string | null>>

  currentShape: ReturnType<typeof useGlobalNamed>
  currentShapeIRI: ComputedRef<string | undefined>
}

export const [useFile, provideFileContext] = createContext<FileContext>('File')

export function useFileStore() {
  const { store } = useFile()
  return store
}
</script>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

// Keep track of file
const fileId = computed(() => {
  if (typeof route.params.fileId !== 'string') {
    throw new Error('File ID is expected to be a string, found ' + typeof route.params.fileId)
  }

  return route.params.fileId
})

const storageKey = computed(() => `file-${fileId.value}`)
const fileInStorage = useStorage<string>(storageKey, null) // This can never be null since the router beforeEnter will redirect to the home page if the file is not found
const file = computed(() => {
  const newFile = Files.parseFile(fileInStorage.value)
  if (!newFile) {
    throw new Error('File is invalid')
  }

  return newFile
})

const updateActiveNamespaces = Namespaces.useActivateNamespacesFromStoreWithoutContext({
  file,
  fileInStorage,
})
const activeNamespacesDefinitions = Namespaces.useActiveNamespacesDefinitionsWithoutContext({
  file,
  fileInStorage,
})
Namespaces.usePrefixSuggestionsForActiveNamespaces(activeNamespacesDefinitions)

// Keep track of the store
const store = ref(graph()) as Ref<IndexedFormula>
const deserializationError = ref<string | null>(null)

function watchStore(store: IndexedFormula) {
  function updateFileInStorage() {
    const serialized = Shacl.serialize(
      store,
      activeNamespacesDefinitions.value,
      file.value.explicitBase ?? file.value.implicitBase ?? null,
    )
    if (!serialized) return

    ignoreStorageUpdates(() => {
      fileInStorage.value = Files.serializeFile({
        ...file.value,
        store: serialized,
        updated: new Date().toISOString(),
      })
    })
  }

  store.addDataCallback(updateFileInStorage)
  store.addDataRemovalCallback(updateFileInStorage)
}

const { ignoreUpdates: ignoreStorageUpdates } = watchIgnorable(
  file,
  (fileUpdated) => {
    const [error, deserialized] = tryCatch(Shacl.deserialize, fileUpdated.store)
    if (error) {
      deserializationError.value = error.message
      return
    }

    updateActiveNamespaces(deserialized.store)

    watchStore(deserialized.store)
    store.value = deserialized.store

    if (
      file.value.implicitBase !== deserialized.implicitBase ||
      file.value.explicitBase !== deserialized.explicitBase
    ) {
      Files.updateBase(fileId.value, {
        implicitBase: deserialized.implicitBase,
        explicitBase: deserialized.explicitBase,
      })
    }

    deserializationError.value = null
  },
  { immediate: true },
)

// Keep track of the current shape
const currentShapeIRI = computed(() => {
  if (typeof route.params.shapeId !== 'string') return undefined
  const shapeId = decodeURIComponent(route.params.shapeId)
  if (!shapeId.includes(':')) return undefined
  return shapeId
})
const currentShape = useGlobalNamed({ initialValue: currentShapeIRI, store })
watch(currentShape.value, (iri) => {
  if (!iri) return

  ignoreCurrentShapeIRIUpdates(() => {
    router.replace(`/file/${fileId.value}/${encodeURIComponent(iri)}`)
  })
})
const { ignoreUpdates: ignoreCurrentShapeIRIUpdates } = watchIgnorable(
  currentShapeIRI,
  routeToValidShape,
  { immediate: true },
)

function routeToValidShape() {
  const currentPath = route.path

  if (currentShapeIRI.value && Shacl.shapeExists(store.value, currentShapeIRI.value)) {
    currentShape.node.value = new NamedNode(currentShapeIRI.value)
    return
  }

  const firstShape = Shacl.getAllShapes(store.value)[0]
  if (firstShape) {
    currentShape.node.value = new NamedNode(firstShape.value)
    const targetPath = `/file/${fileId.value}/${encodeURIComponent(firstShape.value)}`
    if (currentPath !== targetPath) {
      router.replace(targetPath)
    }
    return
  }

  currentShape.node.value = undefined
  const targetPath = `/file/${fileId.value}/`
  if (currentPath !== targetPath) {
    router.replace(targetPath)
  }
}

provideFileContext({
  fileId,
  fileInStorage,
  file,
  store,
  deserializationError: readonly(deserializationError),
  currentShape,
  currentShapeIRI,
})
</script>

<template>
  <slot />
</template>
