import type { ContentType } from 'rdflib/lib/types'

export { default as NamespaceManager } from './manager.vue'
export * as Namespaces from './namespaces'
export * as Prefixes from './prefixes'

export type NamespaceDefinition = {
  prefix: string
  iri: string
} & (
  | { fetchUrl?: string; contentType?: ContentType; suggestions?: never; file?: never }
  | {
      suggestions: PrefixSuggestion[]
      fetchUrl?: never
      contentType?: never
      file?: never
    }
  | {
      file: string
      contentType?: ContentType
      fetchUrl?: never
      suggestions?: never
    }
)

export type PrefixSuggestion = {
  label: string
  iri: string
}
