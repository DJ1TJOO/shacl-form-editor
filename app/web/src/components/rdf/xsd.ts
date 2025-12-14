import { getNamedNode, RDF } from '@/components/rdf'
import { Namespace } from 'rdflib'
import type { NamedNode } from 'rdflib/lib/tf-types'

export const XSD = Namespace('http://www.w3.org/2001/XMLSchema#')

export const string = XSD('string')
export const integer = XSD('integer')
export const decimal = XSD('decimal')
export const float = XSD('float')
export const double = XSD('double')
export const boolean = XSD('boolean')
export const date = XSD('date')
export const time = XSD('time')
export const dateTime = XSD('dateTime')

export function isString(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  const stringDataTypes = [XSD('string'), RDF('langString'), RDF('html')]
  return stringDataTypes.some((type) => iriNode.equals(type))
}

export function isBoolean(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  return iriNode.equals(XSD('boolean'))
}

export function isDate(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  const dateDataTypes = [XSD('dateTime'), XSD('date')]
  return dateDataTypes.some((type) => iriNode.equals(type))
}

export function isDateOnly(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  return iriNode.equals(XSD('date'))
}

export function isDateTime(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  return iriNode.equals(XSD('dateTime'))
}

export function isInteger(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  const integerDataTypes = [XSD('integer'), XSD('long'), XSD('short')]
  return integerDataTypes.some((type) => iriNode.equals(type))
}

export function isDecimal(iri: string | NamedNode): boolean {
  const iriNode = getNamedNode(iri)
  const decimalDataTypes = [XSD('decimal'), XSD('double'), XSD('float')]
  return decimalDataTypes.some((type) => iriNode.equals(type))
}
