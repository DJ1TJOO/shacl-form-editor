import { useStorage } from '@vueuse/core'
import { graph, IndexedFormula, parse } from 'rdflib'
import { computed, watch, type ComputedRef, type Ref } from 'vue'
import type { NamespaceDefinition, PrefixSuggestion } from '.'
import { packagedNamespaces } from './packaged/packaged'
import { usePrefixSuggestions } from './prefixes'

export function useActiveNamespaces() {
  return useStorage<NamespaceDefinition['prefix'][]>('active-namespaces', ['xsd', 'sh'])
}

export function useActiveNamespacesDefinitions(
  store?: Ref<IndexedFormula | undefined> | ComputedRef<IndexedFormula | undefined>,
): ComputedRef<NamespaceDefinition[]> {
  const customNamespaces = useCustomNamespaces()
  const activeNamespaces = useActiveNamespaces()

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

export function useCustomNamespaces() {
  return useStorage<NamespaceDefinition[]>('custom-namespaces', [])
}

export function usePrefixSuggestionsForActiveNamespaces() {
  const customNamespaces = useCustomNamespaces()

  const activeNamespaces = useActiveNamespaces()
  const activeNamespacesDefinitions = computed(() =>
    activeNamespaces.value
      .map(
        (prefix) =>
          customNamespaces.value.find((namespace) => namespace.prefix === prefix) ??
          packagedNamespaces.find((namespace) => namespace.prefix === prefix) ??
          null,
      )
      .filter((namespace) => namespace !== null),
  )

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
    activeNamespacesDefinitions,
    async (newActiveNamespacesDefinitions) => {
      await updatePrefixSuggestionsFromFile(newActiveNamespacesDefinitions)
      updatePrefixSuggestionsFromSuggestions(newActiveNamespacesDefinitions)
      await updatePrefixSuggestionsFromFetch(newActiveNamespacesDefinitions)
    },
    { immediate: true },
  )

  return {
    activeNamespaces,
    activeNamespacesDefinitions,
    prefixSuggestions,
  }
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

  // The JSON-LD parser in rdflib cannot parse just the @context
  // @TODO: Test if this works for all cases
  if (namespace.contentType === 'application/ld+json') {
    const jsonld = JSON.parse(file)

    if (Object.keys(jsonld).length === 1 && jsonld['@context']) {
      const namedNodes = prefixSuggestionsFromJsonLdContext(jsonld['@context'], namespace.prefix)
      return namedNodes
    }
  }

  await new Promise((resolve, reject) =>
    parse(file, tmpStore, namespace.iri, namespace.contentType || 'application/html', (error) => {
      if (error) {
        reject(error)
      }
      resolve(undefined)
    }),
  )

  const namedNodes = getNamedNodesFromStore(tmpStore).filter(
    (iri) => iri.startsWith(namespace.iri) && iri !== namespace.iri,
  )

  return namedNodes.map((iri) => ({
    label: `${namespace.prefix}:${iri.split(namespace.iri)[1]}`,
    iri,
  }))
}

type JsonLdContext = Record<
  string,
  string | { '@id'?: string; '@type'?: string; '@container'?: string }
>
export function prefixSuggestionsFromJsonLdContext(
  jsonLdContext: JsonLdContext,
  prefix: string,
): PrefixSuggestion[] {
  const namespaceIri = jsonLdContext[prefix]
  if (typeof namespaceIri !== 'string') {
    return []
  }

  const results: PrefixSuggestion[] = []
  for (const [term, definition] of Object.entries(jsonLdContext)) {
    if (term === prefix || term.startsWith('@')) {
      continue
    }

    let iri: string | undefined

    if (typeof definition === 'string') {
      if (definition.startsWith(namespaceIri)) {
        iri = definition
      } else if (definition.startsWith(`${prefix}:`)) {
        const localPart = definition.substring(prefix.length + 1)
        iri = `${namespaceIri}${localPart}`
      }
    } else if (definition && typeof definition === 'object') {
      const id = definition['@id']
      if (typeof id === 'string') {
        if (id.startsWith(namespaceIri)) {
          iri = id
        } else if (id.startsWith(`${prefix}:`)) {
          const localPart = id.substring(prefix.length + 1)
          iri = `${namespaceIri}${localPart}`
        }
      }
    }

    if (iri && iri.startsWith(namespaceIri)) {
      const localPart = iri.substring(namespaceIri.length)
      results.push({
        label: `${prefix}:${localPart}`,
        iri,
      })
    }
  }

  return results.sort((a, b) => a.label.localeCompare(b.label))
}
