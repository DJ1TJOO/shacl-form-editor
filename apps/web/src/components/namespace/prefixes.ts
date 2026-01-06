import { useFile } from '@/components/file'
import { Shacl } from '@/components/rdf'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { type NamespaceDefinition, type PrefixSuggestion } from '.'
import { getNamedNodesFromStoreWithTypes, useActiveNamespaces } from './namespaces'

export function usePrefixSuggestions() {
  return useStorage<Record<string, PrefixSuggestion[]>>('prefix-suggestions', {})
}

export function usePrefixSuggestionsList(types?: readonly [string, ...string[]]) {
  const { store, file } = useFile()

  const storedSuggestions = computed(() => {
    const namedNodes = getNamedNodesFromStoreWithTypes(store.value, true)
    const namespaces = Object.entries(store.value.namespaces).map(([prefix, iri]) => ({
      prefix,
      iri,
    }))

    return namedNodes.map(({ iri, types }) => ({
      label: absoluteToPrefixed(namespaces, file.value.implicitBase, iri),
      iri,
      types,
    }))
  })

  const activeNamespaces = useActiveNamespaces()
  const prefixSuggestions = usePrefixSuggestions()
  return computed<PrefixSuggestion[]>(() =>
    Object.entries(prefixSuggestions.value)
      .filter(([prefix]) => activeNamespaces.value.includes(prefix))
      .map(([, suggestions]) => suggestions)
      .reduce(
        (acc, curr) => {
          const merged = [...acc]

          for (const suggestion of curr) {
            const existing = merged.find((s) => s.iri === suggestion.iri)

            if (!existing) {
              merged.push(suggestion)
            } else {
              existing.types = Array.from(new Set([...existing.types, ...suggestion.types]))
            }
          }

          return merged
        },
        store ? storedSuggestions.value : [],
      )
      .filter((suggestion) =>
        types ? types.some((type) => suggestion.types.includes(type)) : true,
      ),
  )
}

export function prefixedToAbsolute(
  namespaces: NamespaceDefinition[],
  implicitBase: string | undefined | null,
  prefixed: string,
) {
  if (implicitBase && prefixed.startsWith(':')) {
    return implicitBase + prefixed.slice(1)
  }

  const namespace = namespaces.find(({ prefix }) => prefixed.startsWith(prefix + ':'))
  if (!namespace) return prefixed

  return namespace.iri + prefixed.split(':')[1]
}

// The user may provide a URI with a different protocol or separator, we guess that they want to use the same prefix, so we need to extract the base URI
// @TODO: discuss if this feature is needed, could cause confusion if the user wants to use a differnt protocol or separator for an existing prefix
function getBasicURI(uri: string): string {
  let base = uri.replace(/^https?:\/\//, '')

  if (base.endsWith('#') || base.endsWith('/')) {
    base = base.slice(0, -1)
  } else {
    const hashIndex = base.lastIndexOf('#')
    const slashIndex = base.lastIndexOf('/')
    const separatorIndex = Math.max(hashIndex, slashIndex)
    if (separatorIndex > 0) {
      base = base.substring(0, separatorIndex)
    }
  }

  return base
}

export function absoluteToPrefixed(
  namespaces: NamespaceDefinition[],
  implicitBase: string | undefined | null,
  absolute: string,
) {
  const absoluteBase = getBasicURI(absolute)
  const localName = Shacl.getLocalName(absolute)
  if (!localName) return absolute

  if (implicitBase && absoluteBase === getBasicURI(implicitBase)) {
    return `:${localName}`
  }

  const namespace = namespaces.find(({ iri }) => getBasicURI(iri) === absoluteBase)
  if (!namespace) return absolute

  return `${namespace.prefix}:${localName}`
}
