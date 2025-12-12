import { recalculateOrdersForShape } from '@/components/properties/ordering'
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

  return iriValue
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
  const properties = store.each(getNamedNode(iri), SHACL('property'))
  for (const property of properties) {
    if (!(property instanceof BlankNode)) continue
    // @TODO: remove groups
    store.removeMatches(property, null, null)
  }

  store.removeMatches(getNamedNode(iri))
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

function getProperty(store: IndexedFormula, property: NamedNode | BlankNode) {
  let editor = store.anyStatementMatching(property, Dash.DASH('editor'))?.object
  if (!(editor instanceof NamedNode)) {
    editor = undefined
  }

  let viewer = store.anyStatementMatching(property, Dash.DASH('viewer'))?.object
  if (!(viewer instanceof NamedNode)) {
    viewer = undefined
  }

  let order = store.anyStatementMatching(property, SHACL('order'))?.object
  if (!(order instanceof Literal)) {
    order = undefined
  }

  let group = store.anyStatementMatching(property, SHACL('group'))?.object
  if (!(group instanceof NamedNode)) {
    group = undefined
  }

  return {
    value: property,
    editor,
    viewer,
    order,
    group,
    type: 'property' as const,
  }
}

export function getNodeProperties(store: IndexedFormula, shape: Quad_Subject) {
  const properties = store
    .statementsMatching(shape, SHACL('property'))
    .filter(
      (statement) => statement.object instanceof BlankNode || statement.object instanceof NamedNode,
    )
    .map((statement) => getProperty(store, statement.object as BlankNode | NamedNode))

  const groups = [
    ...new Set(properties.map((property) => property.group?.value).filter(Boolean) as string[]),
  ].map((group) => {
    let order = store.anyStatementMatching(new NamedNode(group), SHACL('order'))?.object
    if (!(order instanceof Literal)) {
      order = undefined
    }

    return {
      value: new NamedNode(group),
      order,
    }
  })

  const groupedProperties = properties.filter((prop) => prop.group)
  const ungroupedProperties = properties.filter((prop) => !prop.group)

  const combined = [
    ...groups.map((group) => ({
      ...group,
      properties: groupedProperties
        .filter((prop) => prop.group?.equals(group.value))
        .toSorted((a, b) => {
          const orderA = a.order ? (Node.toJS(a.order) as number) : Number.MAX_SAFE_INTEGER
          const orderB = b.order ? (Node.toJS(b.order) as number) : Number.MAX_SAFE_INTEGER
          return orderA - orderB
        }),
      type: 'group' as const,
    })),
    ...ungroupedProperties,
  ].toSorted((a, b) => {
    const orderA = a.order ? (Node.toJS(a.order) as number) : Number.MAX_SAFE_INTEGER
    const orderB = b.order ? (Node.toJS(b.order) as number) : Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  return combined
}

export function getGroupProperties(store: IndexedFormula, group: Quad_Subject) {
  return store
    .statementsMatching(null, SHACL('group'), group)
    .filter(
      (statement) =>
        statement.subject instanceof BlankNode || statement.subject instanceof NamedNode,
    )
    .map((statement) => getProperty(store, statement.subject as BlankNode | NamedNode))
    .toSorted((a, b) => {
      const orderA = a.order ? (Node.toJS(a.order) as number) : Number.MAX_SAFE_INTEGER
      const orderB = b.order ? (Node.toJS(b.order) as number) : Number.MAX_SAFE_INTEGER
      return orderA - orderB
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
  group?: BlankNode | NamedNode,
) {
  const property = new BlankNode()
  store.add(property, Dash.DASH('editor'), Dash.editors[editor])
  store.add(property, Dash.DASH('viewer'), Dash.viewers[viewer])
  store.add(getNamedNode(shape), SHACL('property'), property)
  if (group !== undefined) {
    store.add(property, SHACL('group'), group)
  }
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
  store.removeMatches(property)

  const shapes = store
    .each(null, SHACL('property'), property)
    .filter((node) => node instanceof NamedNode)
  store.removeMatches(null, SHACL('property'), property)

  for (const shape of shapes) {
    recalculateOrdersForShape(store, shape)
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
