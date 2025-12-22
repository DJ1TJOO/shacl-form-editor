import { type NamespaceDefinition } from '@/components/namespace'
import { recalculateOrdersForShape } from '@/components/properties/list/ordering'
import { Dash, getNamedNode, RDF } from '@/components/rdf'
import type { IndexedFormula } from 'rdflib'
import { BlankNode, graph, Literal, NamedNode, Namespace, Node, parse } from 'rdflib'
import type {
  BlankNode as BlankNodeType,
  NamedNode as NamedNodeType,
  Quad_Subject,
} from 'rdflib/lib/tf-types'

export const SHACL = Namespace('http://www.w3.org/ns/shacl#')
export const nodeKinds = [
  SHACL('BlankNode'),
  SHACL('IRI'),
  SHACL('Literal'),
  SHACL('BlankNodeOrIRI'),
  SHACL('BlankNodeOrLiteral'),
  SHACL('IRIOrLiteral'),
] as const

export function getLocalName(iri?: string | NamedNodeType) {
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

export interface AddNodeShape {
  store: IndexedFormula
  iri: string | NamedNodeType
  targetClass: (string | NamedNodeType)[]
  targetNode: (string | NamedNodeType)[]
  targetSubjectsOf: (string | NamedNodeType)[]
  targetObjectsOf: (string | NamedNodeType)[]
}

export function addNodeShape({
  store,
  iri,
  targetClass,
  targetNode,
  targetSubjectsOf,
  targetObjectsOf,
}: AddNodeShape) {
  const shape = getNamedNode(iri)
  store.add(shape, RDF('type'), SHACL('NodeShape'))

  targetClass.forEach((classEntry) => {
    store.add(shape, SHACL('targetClass'), getNamedNode(classEntry))
  })
  targetNode.forEach((nodeEntry) => {
    store.add(shape, SHACL('targetNode'), getNamedNode(nodeEntry))
  })
  targetSubjectsOf.forEach((subjectEntry) => {
    store.add(shape, SHACL('targetSubjectsOf'), getNamedNode(subjectEntry))
  })
  targetObjectsOf.forEach((objectEntry) => {
    store.add(shape, SHACL('targetObjectsOf'), getNamedNode(objectEntry))
  })
}

export function removeShape(store: IndexedFormula, iri: string | NamedNodeType) {
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

function getNodeProps(store: IndexedFormula, shape: Quad_Subject) {
  return store
    .statementsMatching(shape, SHACL('property'))
    .filter(
      (statement) => statement.object instanceof BlankNode || statement.object instanceof NamedNode,
    )
    .map((statement) => getProperty(store, statement.object as BlankNode | NamedNode))
}

export function getNodeProperties(store: IndexedFormula, shape: Quad_Subject) {
  const properties = getNodeProps(store, shape)

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

export function shapeExists(store: IndexedFormula, iri: string | NamedNodeType) {
  return Boolean(
    store.holds(getNamedNode(iri), RDF('type'), SHACL('NodeShape')) ||
      store.holds(getNamedNode(iri), RDF('type'), SHACL('PropertyShape')),
  )
}

export function getMaxOrderOfNode(store: IndexedFormula, shape: Quad_Subject) {
  const shapeProperties = getNodeProps(store, shape)
  const ungroupedProperties = shapeProperties.filter((prop) => {
    const group = store.anyStatementMatching(prop.value, SHACL('group'))?.object
    return !(group instanceof NamedNode)
  })

  const orders = ungroupedProperties
    .map((prop) => {
      const order = store.anyStatementMatching(prop.value, SHACL('order'))?.object
      return order instanceof Literal ? (Node.toJS(order) as number) : undefined
    })
    .filter((order): order is number => order !== undefined)
  return orders.length > 0 ? Math.max(...orders, 0) : null
}

export interface AddPropertyShape {
  store: IndexedFormula
  iri?: string | NamedNodeType
  editor: keyof typeof Dash.editors
  viewer: keyof typeof Dash.viewers
  order?: number
  group?: BlankNodeType | NamedNodeType
  datatype?: string | NamedNodeType
  nodeKind?: string | NamedNodeType
}

export function addPropertyShape({
  store,
  iri,
  editor,
  viewer,
  order,
  group,
  datatype,
  nodeKind,
}: AddPropertyShape) {
  const property = iri ? getNamedNode(iri) : new BlankNode()
  if (iri) {
    store.add(property, RDF('type'), SHACL('PropertyShape'))
  }

  store.add(property, Dash.DASH('editor'), Dash.editors[editor])
  store.add(property, Dash.DASH('viewer'), Dash.viewers[viewer])
  if (datatype !== undefined) {
    store.add(property, SHACL('datatype'), getNamedNode(datatype))
  }
  if (nodeKind !== undefined) {
    store.add(property, SHACL('nodeKind'), getNamedNode(nodeKind))
  }
  if (group !== undefined) {
    store.add(property, SHACL('group'), group)
  }
  if (order !== undefined) {
    store.add(property, SHACL('order'), Literal.fromValue<Literal>(order))
  }

  return property
}

export function createPropertyForShape({
  shape,
  store,
  order,
  ...props
}: Omit<AddPropertyShape, 'iri'> & {
  shape: string | NamedNodeType
}) {
  const shapeNode = getNamedNode(shape)

  let propertyOrder = order
  if (propertyOrder === undefined) {
    const maxOrder = getMaxOrderOfNode(store, shapeNode)
    propertyOrder = maxOrder !== null ? maxOrder + 1 : 0
  }

  const property = addPropertyShape({
    order: propertyOrder,
    store,
    ...props,
  })
  store.add(shapeNode, SHACL('property'), property)

  return property
}

export function removeProperty(store: IndexedFormula, property: BlankNode | NamedNodeType) {
  store.removeMatches(property)

  const shapes = store
    .each(null, SHACL('property'), property)
    .filter((node) => node instanceof NamedNode)
  store.removeMatches(null, SHACL('property'), property)

  for (const shape of shapes) {
    recalculateOrdersForShape(store, shape)
  }
}

export function serialize(store: IndexedFormula, namespaces: NamespaceDefinition[]) {
  for (const namespace of namespaces) {
    store.setPrefixForURI(namespace.prefix, namespace.iri)
  }

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

export function download(store: IndexedFormula, namespaces: NamespaceDefinition[], debug = false) {
  const serialized = serialize(store, namespaces)
  if (!serialized) return

  if (debug) {
    console.log(serialized)
    return
  }

  const blob = new Blob([serialized], { type: 'text/turtle;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'data.ttl'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
