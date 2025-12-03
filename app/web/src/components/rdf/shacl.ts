import { Dash, RDF } from '@/components/rdf'
import type { NamedNode as NamedNodeType } from '@rdfjs/types'
import type { IndexedFormula } from 'rdflib'
import { BlankNode, NamedNode, Namespace } from 'rdflib'

export const SHACL = Namespace('http://www.w3.org/ns/shacl#')

export function getLocalName(iri?: NamedNodeType) {
  const name = iri?.value.split('/').pop()
  if (!name) {
    return undefined
  }

  return name
}

function getNamedNode(iri: string | NamedNode) {
  return iri instanceof NamedNode ? iri : new NamedNode(iri)
}

export function addShape(
  store: IndexedFormula,
  iri: string | NamedNode,
  type: 'node' | 'property',
) {
  store.add(
    getNamedNode(iri),
    RDF('type'),
    type === 'node' ? SHACL('NodeShape') : SHACL('PropertyShape'),
  )
}

export function removeShape(store: IndexedFormula, iri: string | NamedNode) {
  store.removeMany(getNamedNode(iri))
}

export function createProperty(
  store: IndexedFormula,
  shape: string | NamedNode,
  editor: keyof typeof Dash.editors,
  viewer: keyof typeof Dash.viewers,
) {
  const property = new BlankNode()
  store.add(property, Dash.DASH('editor'), Dash.editors[editor])
  store.add(property, Dash.DASH('viewer'), Dash.viewers[viewer])
  store.add(getNamedNode(shape), SHACL('property'), property)
}

export function serialize(store: IndexedFormula) {
  const serialized = store.serialize(null, null, null)
  if (!serialized) return

  return serialized
}

export function removeProperty(store: IndexedFormula, property: BlankNode | NamedNode) {
  store.removeMany(property)
  store.removeMatches(null, SHACL('property'), property)
}
