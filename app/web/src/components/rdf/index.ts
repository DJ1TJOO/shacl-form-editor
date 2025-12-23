import { NamedNode, Namespace } from 'rdflib'
import type { NamedNode as NamedNodeType } from 'rdflib/lib/tf-types'

export * as Dash from './dash'
export * as Shacl from './shacl'
export * as Xsd from './xsd'

export const RDF = Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
export const RDFS = Namespace('http://www.w3.org/2000/01/rdf-schema#')
export const OWL = Namespace('http://www.w3.org/2002/07/owl#')

export const RDF_CLASS_TYPES = [RDFS('Class').value, OWL('Class').value] as const
export const RDF_PROPERTY_TYPES = [
  RDF('Property').value,
  OWL('ObjectProperty').value,
  OWL('DatatypeProperty').value,
  OWL('AnnotationProperty').value,
] as const

export function getNamedNode(iri: string | NamedNodeType) {
  return typeof iri === 'string' ? new NamedNode(iri) : iri
}
