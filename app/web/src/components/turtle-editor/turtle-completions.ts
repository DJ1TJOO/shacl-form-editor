import type { NamespaceDefinition, PrefixSuggestion } from '@/components/namespace'
import { RDF_CLASS_TYPES, RDF_PROPERTY_TYPES } from '@/components/rdf'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

export function turtleCompletions(
  model: monaco.editor.ITextModel,
  range: monaco.IRange,
  namespaces: NamespaceDefinition[],
  prefixSuggestions: PrefixSuggestion[],
) {
  const languageSuggestions = [
    {
      label: '@base',
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: '@base <${1:uri}> .',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
    },
    {
      label: '@prefix',
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: '@prefix ${1:prefix}: <${2:uri}> .',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
    },
    {
      label: 'a',
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: 'a ',
      detail: 'rdf:type',
      range,
    },
  ]

  // Prefixes
  const namespaceSuggestions = namespaces.map((namespace) => ({
    label: namespace.prefix,
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: `${namespace.prefix}:`,
    detail: namespace.iri,
    range,
  }))

  // Extract defined prefixes from content
  const content = model.getValue()
  const prefixRegex = /@prefix\s+([^:]+):\s*<([^>]+)>/g
  let match

  while ((match = prefixRegex.exec(content)) !== null) {
    const prefix = match[1]
    const localName = match[2]
    if (!prefix || !localName) continue
    if (!namespaceSuggestions.some((suggestion) => suggestion.label === prefix)) {
      namespaceSuggestions.push({
        label: prefix,
        kind: monaco.languages.CompletionItemKind.Module,
        insertText: `${prefix}:`,
        detail: localName,
        range,
      })
    }
  }

  // Prefix suggestions
  const prefixSuggestionsSuggestions = prefixSuggestions.map((suggestion) => ({
    label: suggestion.label,
    kind: suggestion.types.some((type) => RDF_CLASS_TYPES.includes(type))
      ? monaco.languages.CompletionItemKind.Class
      : suggestion.types.some((type) => RDF_PROPERTY_TYPES.includes(type))
        ? monaco.languages.CompletionItemKind.Property
        : monaco.languages.CompletionItemKind.Variable,
    insertText: suggestion.label,
    detail: suggestion.iri,
    range,
  }))

  return {
    suggestions: [...languageSuggestions, ...namespaceSuggestions, ...prefixSuggestionsSuggestions],
  }
}
