import { Files, useFile, type FileContext } from '@/components/file'
import { RDF } from '@/components/rdf'
import { useStorage } from '@vueuse/core'
import { graph, IndexedFormula, NamedNode, parse } from 'rdflib'
import { computed, watch, type ComputedRef, type Ref } from 'vue'
import type { NamespaceDefinition, PrefixSuggestion } from '.'
import { packagedNamespaces } from './packaged/packaged'
import { usePrefixSuggestions } from './prefixes'

export const DEFAULT_ACTIVE_NAMESPACES = ['xsd', 'sh']

export function useActiveNamespacesWithoutContext({
  file,
  fileInStorage,
}: Pick<FileContext, 'file' | 'fileInStorage'>) {
  const activeNamespaces = computed({
    get: () => file.value.activeNamespaces,
    set: (value) => {
      fileInStorage.value = Files.serializeFile({
        ...file.value,
        activeNamespaces: value,
      })
    },
  })
  return activeNamespaces
}

export function useActiveNamespaces() {
  const { file, fileInStorage } = useFile()
  return useActiveNamespacesWithoutContext({ file, fileInStorage })
}

export function useActiveNamespacesDefinitionsWithoutContext(
  { file, fileInStorage }: Pick<FileContext, 'file' | 'fileInStorage'>,
  store?: Ref<IndexedFormula | undefined> | ComputedRef<IndexedFormula | undefined>,
): ComputedRef<NamespaceDefinition[]> {
  const customNamespaces = useCustomNamespaces()
  const activeNamespaces = useActiveNamespacesWithoutContext({ file, fileInStorage })

  return computed(() => {
    const storeNamespaces = store?.value
      ? Object.entries(store.value.namespaces).map(([prefix, iri]) => ({
          prefix,
          iri,
        }))
      : []

    return storeNamespaces.concat(
      activeNamespaces.value
        .map(
          (prefix) =>
            customNamespaces.value.find((namespace) => namespace.prefix === prefix) ??
            packagedNamespaces.find((namespace) => namespace.prefix === prefix) ??
            null,
        )
        .filter((namespace) => namespace !== null),
    )
  })
}

export function useActiveNamespacesDefinitions(): ComputedRef<NamespaceDefinition[]> {
  const { file, fileInStorage, store } = useFile()
  return useActiveNamespacesDefinitionsWithoutContext({ file, fileInStorage }, store)
}

export function useCustomNamespaces() {
  return useStorage<NamespaceDefinition[]>('custom-namespaces', [])
}

export function usePrefixSuggestionsForActiveNamespaces(
  activeNamespaces: ComputedRef<NamespaceDefinition[]>,
) {
  const prefixSuggestions = usePrefixSuggestions()

  async function updatePrefixSuggestionsFromFile(
    newActiveNamespacesDefinitions: NamespaceDefinition[],
  ) {
    const namespacesWithFile = newActiveNamespacesDefinitions.filter(
      (definition): definition is NamespaceDefinition & { file: string } => {
        return (
          !!definition.file &&
          definition.file.length > 0 &&
          !(definition.prefix in prefixSuggestions.value)
        )
      },
    )

    for (const namespace of namespacesWithFile) {
      prefixSuggestions.value[namespace.prefix] = await parsePrefixSuggestionsFromFile(
        namespace.file,
        namespace,
      )
    }
  }

  function updatePrefixSuggestionsFromSuggestions(
    newActiveNamespacesDefinitions: NamespaceDefinition[],
  ) {
    const namespacesWithSuggestions = newActiveNamespacesDefinitions.filter(
      (definition): definition is NamespaceDefinition & { suggestions: PrefixSuggestion[] } => {
        return (
          !!definition.suggestions &&
          definition.suggestions.length > 0 &&
          !(definition.prefix in prefixSuggestions.value)
        )
      },
    )

    for (const namespace of namespacesWithSuggestions) {
      prefixSuggestions.value[namespace.prefix] = namespace.suggestions
    }
  }

  async function updatePrefixSuggestionsFromFetch(
    newActiveNamespacesDefinitions: NamespaceDefinition[],
  ) {
    const namespacesToFetch = newActiveNamespacesDefinitions.filter(
      (definition) => definition.fetchUrl && !(definition.prefix in prefixSuggestions.value),
    )

    const namespaces = await Promise.all(
      namespacesToFetch.map(async (definition) => ({
        definition,
        prefixSuggestions: await fetchPrefixSuggestionFromNamespace(definition),
      })),
    )

    for (const { definition, prefixSuggestions: newPrefixSuggestions } of namespaces) {
      prefixSuggestions.value[definition.prefix] = newPrefixSuggestions
    }
  }

  watch(
    activeNamespaces,
    async (newActiveNamespacesDefinitions) => {
      await updatePrefixSuggestionsFromFile(newActiveNamespacesDefinitions)
      updatePrefixSuggestionsFromSuggestions(newActiveNamespacesDefinitions)
      await updatePrefixSuggestionsFromFetch(newActiveNamespacesDefinitions)
    },
    { immediate: true },
  )

  return prefixSuggestions
}

export function getNamedNodesFromStore(store: IndexedFormula, ignoreDefaultNamespaces = false) {
  const all = store.statements
    .flatMap((st) => [st.subject, st.predicate, st.object, st.graph])
    .filter(
      (node) =>
        node.termType === 'NamedNode' &&
        (!ignoreDefaultNamespaces ||
          (!node.value.startsWith('http://www.w3.org/1999/02/22-rdf-syntax-ns#') &&
            !node.value.endsWith('#') &&
            !node.value.endsWith('/'))),
    )
    .map((node) => node.value)

  return [...new Set(all)]
}

export function getNamedNodesFromStoreWithTypes(
  store: IndexedFormula,
  ignoreDefaultNamespaces = false,
) {
  const namedNodes = getNamedNodesFromStore(store, ignoreDefaultNamespaces)
  return namedNodes.map((iri) => {
    const types = store.each(new NamedNode(iri), RDF('type'))
    return {
      iri,
      types: types.map((type) => type.value),
    }
  })
}

export async function fetchPrefixSuggestionFromNamespace(
  namespace: NamespaceDefinition,
): Promise<PrefixSuggestion[]> {
  if (!namespace.fetchUrl) return []

  const response = await fetch(namespace.fetchUrl, {
    headers: {
      Accept: namespace.contentType || 'text/html',
    },
  })

  if (!response.ok) return []
  const text = await response.text()
  return await parsePrefixSuggestionsFromFile(text, namespace)
}

export async function parsePrefixSuggestionsFromFile(
  file: string,
  namespace: NamespaceDefinition,
): Promise<PrefixSuggestion[]> {
  const tmpStore = graph()

  await new Promise((resolve, reject) =>
    parse(file, tmpStore, namespace.iri, namespace.contentType || 'application/html', (error) => {
      if (error) {
        reject(error)
      }
      resolve(undefined)
    }),
  )

  const namedNodes = getNamedNodesFromStoreWithTypes(tmpStore).filter(
    ({ iri }) => iri.startsWith(namespace.iri) && iri !== namespace.iri,
  )

  return namedNodes.map(({ iri, types }) => ({
    label: `${namespace.prefix}:${iri.split(namespace.iri)[1]}`,
    iri,
    types,
  }))
}
