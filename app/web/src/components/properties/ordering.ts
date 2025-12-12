import { Shacl } from '@/components/rdf'
import type { IDnDStore } from '@vue-dnd-kit/core'
import { BlankNode, IndexedFormula, Literal, NamedNode, Node } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'

export type DraggingNewProperties = {
  create: (order?: number, group?: BlankNode | NamedNode) => void
}

export type DraggingExistingProperties = {
  subject: Quad_Subject
  order: number
  groupOrder?: number | undefined
  groupSubject?: Quad_Subject | undefined
}

export type DraggingExistingPropertiesInGroup = DraggingExistingProperties & {
  groupSubject: Quad_Subject
  groupOrder: number
}

export type DraggingExistingPropertiesNotInGroup = DraggingExistingProperties & {
  groupSubject: undefined
  groupOrder: undefined
}

export type PropertiesList = {
  order?: Literal
  value: BlankNode | NamedNode
}[]

export function getDraggingNewProperties(dropStore: IDnDStore) {
  return Array.from(dropStore.draggingElements.value.values())
    .map((element) => ({
      create: element.data?.create,
    }))
    .filter((element): element is DraggingNewProperties => typeof element.create === 'function')
}

export function getDraggingExistingProperties(dropStore: IDnDStore) {
  return Array.from(dropStore.draggingElements.value.values())
    .map((element) => ({
      subject: element.data?.subject,
      order: element.data?.order,
      ...(element.data?.groupOrder !== undefined && { groupOrder: element.data.groupOrder }),
      ...(element.data?.groupSubject !== undefined && { groupSubject: element.data.groupSubject }),
    }))
    .filter(
      (element): element is DraggingExistingProperties =>
        element.subject !== undefined &&
        (element.subject instanceof BlankNode || element.subject instanceof NamedNode) &&
        typeof element.order === 'number',
    )
    .sort((a, b) => a.order - b.order)
}

export function isDraggingElement(
  prop: PropertiesList[number],
  draggingElements: DraggingExistingProperties[],
) {
  return draggingElements.some(
    (element) => element.subject === prop.value || element.subject.equals(prop.value),
  )
}

export function getPropertyOrder(prop: { order?: Literal }) {
  if (!prop.order) return undefined
  try {
    return Node.toJS(prop.order) as number
  } catch {
    return undefined
  }
}

export function getTargetOrder(dropStore: IDnDStore) {
  const hoveredElement = dropStore.hovered.element.value
  if (typeof hoveredElement !== 'object' || hoveredElement === null) return undefined
  return dropStore.elementsMap.value.get(hoveredElement)?.data?.order
}

export function getMaxOrder(propertiesList: PropertiesList) {
  return Math.max(...propertiesList.map((prop) => Node.toJS(prop.order) as number), 0)
}

export function addNewPropertiesAtTarget(
  targetOrder: number,
  newProperties: DraggingNewProperties[],
  group?: BlankNode | NamedNode,
) {
  newProperties.forEach((element, index) => element.create?.(targetOrder + index, group))
}

export function addExistingPropertiesAtTarget(
  store: IndexedFormula,
  targetOrder: number,
  existingProperties: DraggingExistingProperties[],
  group?: BlankNode | NamedNode,
) {
  existingProperties.forEach((element, index) => {
    store.removeMatches(element.subject, Shacl.SHACL('group'))
    if (group !== undefined) {
      store.add(element.subject, Shacl.SHACL('group'), group)
    }

    updatePropertyOrder(store, element.subject, element.order, targetOrder + index)
  })
}

export function updatePropertyOrder(
  store: IndexedFormula,
  property: Quad_Subject,
  oldOrder: number,
  newOrder: number,
) {
  if (oldOrder === newOrder) return

  store.removeMatches(property, Shacl.SHACL('order'), Literal.fromValue<Literal>(oldOrder))
  store.add(property, Shacl.SHACL('order'), Literal.fromValue<Literal>(newOrder))
}

export function createOrderingGapAtTarget(
  store: IndexedFormula,
  propertiesList: PropertiesList,
  targetOrder: number,
  numNewProperties: number,
) {
  for (const prop of propertiesList) {
    const propOrder = getPropertyOrder(prop)
    if (typeof propOrder === 'undefined') continue

    if (propOrder >= targetOrder) {
      const newOrder = propOrder + numNewProperties
      updatePropertyOrder(store, prop.value, propOrder, newOrder)
    }
  }
}

export function createOrderingGapForExisting(
  store: IndexedFormula,
  propertiesList: PropertiesList,
  draggingElements: DraggingExistingProperties[],
  targetOrder: number,
) {
  if (draggingElements.length === 0) return

  const draggingOrders = draggingElements.map((el) => el.order)
  const minDraggingOrder = Math.min(...draggingOrders)
  const isMovingDown = minDraggingOrder < targetOrder

  for (const prop of propertiesList) {
    if (isDraggingElement(prop, draggingElements)) continue
    const propOrder = getPropertyOrder(prop)
    if (typeof propOrder === 'undefined') continue

    let newOrder = propOrder

    if (isMovingDown) {
      const draggingBefore = draggingOrders.filter((order) => order < propOrder).length
      if (propOrder > minDraggingOrder && propOrder <= targetOrder) {
        newOrder = propOrder - draggingBefore
      }
    } else {
      const draggingAfter = draggingOrders.filter((order) => order > propOrder).length
      if (propOrder >= targetOrder && propOrder < minDraggingOrder) {
        newOrder = propOrder + draggingAfter
      }
    }

    if (newOrder !== propOrder) {
      updatePropertyOrder(store, prop.value, propOrder, newOrder)
    }
  }
}

export function moveProperty(store: IndexedFormula, property: Quad_Subject, offset: number) {
  if (offset === 0) return

  const orderLiteral = store.any(property, Shacl.SHACL('order'))
  if (!(orderLiteral instanceof Literal)) return

  const currentOrder = Node.toJS(orderLiteral) as number
  const targetOrder = currentOrder + offset

  const shape = store.any(null, Shacl.SHACL('property'), property)
  if (!shape || !(shape instanceof NamedNode)) return

  const propertiesList = Shacl.getNodeProperties(store, shape)
  const propertyOrders = propertiesList
    .map((prop) => ({ prop, order: getPropertyOrder(prop) }))
    .filter(
      (item): item is { prop: typeof item.prop; order: number } => typeof item.order === 'number',
    )
  const swapProperty = propertyOrders.reduce((prev, curr) =>
    Math.abs(curr.order - targetOrder) < Math.abs(prev.order - targetOrder) ? curr : prev,
  )

  if (swapProperty.order !== targetOrder) return
  if (swapProperty.prop.value.equals(property)) return

  updatePropertyOrder(store, property, currentOrder, swapProperty.order)
  updatePropertyOrder(store, swapProperty.prop.value, swapProperty.order, currentOrder)
}

export function recalculateOrdersForShape(store: IndexedFormula, shape: Quad_Subject) {
  const propertiesList = Shacl.getNodeProperties(store, shape)
  const propertyOrders = propertiesList
    .map((prop) => ({ prop, order: getPropertyOrder(prop) }))
    .filter(
      (item): item is { prop: typeof item.prop; order: number } => typeof item.order === 'number',
    )

  for (const [index, prop] of propertyOrders.entries()) {
    updatePropertyOrder(store, prop.prop.value, prop.order, index)

    if (prop.prop.type === 'group') {
      recalculateOrdersForGroup(store, prop.prop.properties)
    }
  }
}

export function recalculateOrdersForGroup(
  store: IndexedFormula,
  group: Quad_Subject | ReturnType<typeof Shacl.getGroupProperties>,
) {
  const propertiesList = Array.isArray(group) ? group : Shacl.getGroupProperties(store, group)
  for (const [index, property] of propertiesList.entries()) {
    const propertyOrder = getPropertyOrder(property)
    if (typeof propertyOrder === 'undefined') continue
    updatePropertyOrder(store, property.value, propertyOrder, index)
  }
}
