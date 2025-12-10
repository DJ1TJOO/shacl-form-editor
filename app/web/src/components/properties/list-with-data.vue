<script setup lang="ts">
import { TextAreaProperty, TextFieldProperty } from '@/components/properties'
import Empty from '@/components/properties/empty.vue'
import PropertiesList from '@/components/properties/list.vue'
import { Dash, injectFileContext, Shacl } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { useDroppable } from '@vue-dnd-kit/core'
import { BlankNode, Literal, NamedNode, Node } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'
import { computed, type Component } from 'vue'

const { currentShape, store } = injectFileContext()
const { properties, removeProperty } = useNodeProperties({ subject: currentShape.namedNode })
const propertyTypes: {
  component: Component
  nodeType: typeof Node
  editor: (keyof typeof Dash.editors)[]
}[] = [
  {
    component: TextFieldProperty,
    nodeType: BlankNode,
    editor: ['TextFieldEditor', 'TextFieldWithLangEditor'],
  },
  {
    component: TextAreaProperty,
    nodeType: BlankNode,
    editor: ['TextAreaEditor', 'TextAreaWithLangEditor'],
  },
] as const

function getPropertyType(property: (typeof properties.value)[number]) {
  for (const type of propertyTypes) {
    if (!(property.value instanceof type.nodeType)) continue
    if (!property.editor) continue
    if (!type.editor.map((editor) => Dash.editors[editor].value).includes(property.editor.value))
      continue
    return type.component
  }
  return undefined
}

const sortedProperties = computed(() =>
  properties.value
    .toSorted((a, b) => {
      const orderA = a.order ? (Node.toJS(a.order) as number) : 0
      const orderB = b.order ? (Node.toJS(b.order) as number) : 0
      return orderA - orderB
    })
    .map((property) => ({
      ...property,
      type: getPropertyType(property),
    })),
)

const { elementRef: dropzoneRef } = useDroppable({
  events: {
    onDrop: (dropStore) => {
      const hoveredElement = dropStore.hovered.element.value

      // @TODO: Make code more readable, split up into smaller functions
      const newProperties = Array.from(dropStore.draggingElements.value.values())
        .map((el) => ({
          id: el.id,
          create: el.data?.create,
        }))
        .filter(
          (el): el is { id: string | number; create: (order?: number) => void } =>
            el.id !== undefined && el.create !== undefined,
        )

      // Adding new properties
      if (newProperties.length > 0) {
        if (hoveredElement) {
          const targetOrder = dropStore.elementsMap.value.get(hoveredElement)?.data?.order
          if (targetOrder === undefined) return
          const numDragging = newProperties.length

          for (const prop of sortedProperties.value) {
            if (!prop.order) continue
            const propOrder = Node.toJS(prop.order) as number

            let newOrder = propOrder

            if (propOrder >= targetOrder) {
              newOrder = propOrder + numDragging
            }

            if (newOrder !== propOrder) {
              store.value.removeMatches(prop.value, Shacl.SHACL('order'), prop.order)
              store.value.add(
                prop.value,
                Shacl.SHACL('order'),
                Literal.fromValue<Literal>(newOrder),
              )
            }
          }

          newProperties.forEach((el, index) => el.create?.(targetOrder + index))
        } else {
          const maxOrder = Math.max(
            ...sortedProperties.value.map((prop) => Node.toJS(prop.order) as number),
            0,
          )
          newProperties.forEach((el, index) => el.create?.(maxOrder + index + 1))
        }

        return
      }

      // Moving existing properties
      if (hoveredElement) {
        const targetOrder = dropStore.elementsMap.value.get(hoveredElement)?.data?.order
        if (targetOrder === undefined) return

        const draggingElements = Array.from(dropStore.draggingElements.value.values())
          .map((el) => ({
            subject: el.data?.subject,
            order: el.data?.order,
          }))
          .filter(
            (el): el is { subject: Quad_Subject; order: number } =>
              el.subject !== undefined &&
              (el.subject instanceof BlankNode || el.subject instanceof NamedNode) &&
              el.order !== undefined,
          )
          .sort((a, b) => a.order - b.order)

        if (draggingElements.length === 0) return

        const draggingOrders = draggingElements.map((el) => el.order)
        const minDraggingOrder = Math.min(...draggingOrders)
        const numDragging = draggingElements.length

        const isMovingDown = minDraggingOrder < targetOrder

        // Move none dragging elements to the correct position
        for (const prop of sortedProperties.value) {
          if (!prop.order) continue
          const propOrder = Node.toJS(prop.order) as number

          if (
            draggingElements.some(
              (el) => el.subject === prop.value || el.subject.equals(prop.value),
            )
          )
            continue

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
            store.value.removeMatches(prop.value, Shacl.SHACL('order'), prop.order)
            store.value.add(prop.value, Shacl.SHACL('order'), Literal.fromValue<Literal>(newOrder))
          }
        }

        // Assign new orders to dragging elements at target position
        draggingElements.forEach((element, index) => {
          let newOrder: number
          if (isMovingDown) {
            newOrder = targetOrder - numDragging + index + 1
          } else {
            newOrder = targetOrder + index
          }

          store.value.removeMatches(
            element.subject,
            Shacl.SHACL('order'),
            Literal.fromValue<Literal>(element.order),
          )
          store.value.add(
            element.subject,
            Shacl.SHACL('order'),
            Literal.fromValue<Literal>(newOrder),
          )
        })
      }
    },
  },
})
</script>

<template>
  <PropertiesList>
    <ul ref="dropzoneRef" class="space-y-2">
      <template v-for="property in sortedProperties" :key="property.value">
        <component
          v-if="property.type"
          :is="property.type"
          :subject="property.value"
          :order="(Node.toJS(property.order) as number) ?? -1"
          @remove="removeProperty(property.value)"
        />
      </template>
      <slot />
      <Empty />
    </ul>
  </PropertiesList>
</template>
