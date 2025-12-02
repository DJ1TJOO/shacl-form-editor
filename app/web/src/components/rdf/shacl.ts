import type { NamedNode as NamedNodeType } from '@rdfjs/types'
import type { IndexedFormula } from 'rdflib'
import { NamedNode, Namespace } from 'rdflib'

export const SHACL = Namespace('http://www.w3.org/ns/shacl#')
export const RDF = Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')

export function getLocalName(iri: NamedNodeType) {
  const name = iri.value.split('/').pop()
  if (!name) {
    throw new Error(`Invalid IRI: ${iri.value}`)
  }

  return name
}

export function addShape(store: IndexedFormula, iri: NamedNodeType) {
  store.add(iri, RDF('type'), SHACL('NodeShape'))
}

export function removeShape(store: IndexedFormula, iri: NamedNodeType) {
  store.removeMany(iri)
}

export function findShapes(store: IndexedFormula) {
  return [
    ...store
      .each(null, RDF('type'), SHACL('NodeShape'))
      .filter((shape) => shape instanceof NamedNode)
      .map((shape) => ({
        node: shape as NamedNode,
        name: getLocalName(shape as NamedNode),
        type: 'node' as const,
      })),
    ...store
      .each(null, RDF('type'), SHACL('PropertyShape'))
      .filter((shape) => shape instanceof NamedNode)
      .map((shape) => ({
        node: shape as NamedNode,
        name: getLocalName(shape as NamedNode),
        type: 'property' as const,
      })),
  ]
}

export function addProperty(store: IndexedFormula, iri: NamedNodeType) {
  store.add(iri, RDF('type'), SHACL('PropertyShape'))
}
