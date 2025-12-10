import { recalculateOrders } from '@/components/properties/ordering'
import { Dash, getNamedNode, RDF } from '@/components/rdf'
import type { IndexedFormula } from 'rdflib'
import { BlankNode, graph, Literal, NamedNode, Namespace, Node, parse } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'

export const SHACL = Namespace('http://www.w3.org/ns/shacl#')
export const nodeKinds = [
  SHACL('BlankNode'),
  SHACL('IRI'),
  SHACL('Literal'),
  SHACL('BlankNodeOrIRI'),
  SHACL('BlankNodeOrLiteral'),
  SHACL('IRIOrLiteral'),
] as const

export function getLocalName(iri?: string | NamedNode) {
  if (!iri) return undefined
  const iriNode = getNamedNode(iri)
  const iriValue = iriNode.value

  const hashIndex = iriValue.lastIndexOf('#')
  const slashIndex = iriValue.lastIndexOf('/')
  const separatorIndex = Math.max(hashIndex, slashIndex)

  if (separatorIndex > 0) {
    return iriValue.substring(separatorIndex + 1)
  }

  return undefined
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

export function getAllShapes(store: IndexedFormula) {
  return [
    ...store
      .each(null, RDF('type'), SHACL('NodeShape'))
      .filter((shape) => shape instanceof NamedNode)
      .map((shape) => ({
        value: shape.value,
        name: getLocalName(shape),
        type: 'node' as const,
      })),
    ...store
      .each(null, RDF('type'), SHACL('PropertyShape'))
      .filter((shape) => shape instanceof NamedNode)
      .map((shape) => {
        let editor = store.anyStatementMatching(shape, Dash.DASH('editor'))?.object
        if (!(editor instanceof NamedNode)) {
          editor = undefined
        }

        let viewer = store.anyStatementMatching(shape, Dash.DASH('viewer'))?.object
        if (!(viewer instanceof NamedNode)) {
          viewer = undefined
        }

        let order = store.anyStatementMatching(shape, SHACL('order'))?.object
        if (!(order instanceof Literal)) {
          order = undefined
        }

        let group = store.anyStatementMatching(shape, SHACL('group'))?.object
        if (!(group instanceof NamedNode)) {
          group = undefined
        }

        return {
          value: shape.value,
          name: getLocalName(shape),
          order,
          group,
          editor,
          viewer,
          type: 'property' as const,
        }
      }),
  ]
}

export function getNodeProperties(store: IndexedFormula, shape: Quad_Subject) {
  return store
    .statementsMatching(shape, SHACL('property'))
    .filter(
      (statement) => statement.object instanceof BlankNode || statement.object instanceof NamedNode,
    )
    .map((statement) => {
      const object = statement.object as BlankNode | NamedNode

      let editor = store.anyStatementMatching(object, Dash.DASH('editor'))?.object
      if (!(editor instanceof NamedNode)) {
        editor = undefined
      }

      let viewer = store.anyStatementMatching(object, Dash.DASH('viewer'))?.object
      if (!(viewer instanceof NamedNode)) {
        viewer = undefined
      }

      let order = store.anyStatementMatching(object, SHACL('order'))?.object
      if (!(order instanceof Literal)) {
        order = undefined
      }

      let group = store.anyStatementMatching(object, SHACL('group'))?.object
      if (!(group instanceof NamedNode)) {
        group = undefined
      }

      return {
        value: object,
        editor,
        viewer,
        order,
        group,
      }
    })
}

export function shapeExists(store: IndexedFormula, iri: string | NamedNode) {
  return Boolean(
    store.holds(getNamedNode(iri), RDF('type'), SHACL('NodeShape')) ||
      store.holds(getNamedNode(iri), RDF('type'), SHACL('PropertyShape')),
  )
}

export function createProperty(
  store: IndexedFormula,
  shape: string | NamedNode,
  editor: keyof typeof Dash.editors,
  viewer: keyof typeof Dash.viewers,
  order?: number,
) {
  const property = new BlankNode()
  store.add(property, Dash.DASH('editor'), Dash.editors[editor])
  store.add(property, Dash.DASH('viewer'), Dash.viewers[viewer])
  store.add(getNamedNode(shape), SHACL('property'), property)

  if (order !== undefined) {
    store.add(property, SHACL('order'), Literal.fromValue<Literal>(order))
  } else {
    const maxOrder = Math.max(
      ...store
        .statementsMatching(null, SHACL('order'))
        .map(({ object }) => Node.toJS(object) as number),
      0,
    )
    store.add(property, SHACL('order'), Literal.fromValue<Literal>(maxOrder + 1))
  }
}

export function removeProperty(store: IndexedFormula, property: BlankNode | NamedNode) {
  store.removeMany(property)

  const shapes = store
    .each(null, SHACL('property'), property)
    .filter((node) => node instanceof NamedNode)
  store.removeMatches(null, SHACL('property'), property)

  for (const shape of shapes) {
    recalculateOrders(store, shape)
  }
}

export function serialize(store: IndexedFormula) {
  const serialized = store.serialize(null, null, null)
  if (!serialized) return null

  return serialized
}

export function deserialize(serialized: string) {
  const store = graph()
  // @TODO: Handle base URI, what is this?
  parse(serialized, store, 'http://localhost:3000/')
  return store
}
