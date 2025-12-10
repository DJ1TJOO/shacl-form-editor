<script setup lang="ts">
import { TextAreaProperty, TextFieldProperty } from '@/components/properties'
import Empty from '@/components/properties/empty.vue'
import PropertiesList from '@/components/properties/list.vue'
import {
  addExistingPropertiesAtTarget,
  addNewPropertiesAtTarget,
  createOrderingGapAtTarget,
  createOrderingGapForExisting,
  getDraggingExistingProperties,
  getDraggingNewProperties,
  getMaxOrder,
  getTargetOrder,
} from '@/components/properties/ordering'
import { Dash, injectFileContext } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { useDroppable } from '@vue-dnd-kit/core'
import { BlankNode, Node } from 'rdflib'
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
      const targetOrder = getTargetOrder(dropStore)
      const newProperties = getDraggingNewProperties(dropStore)

      // Adding new properties
      if (newProperties.length > 0) {
        if (typeof targetOrder !== 'undefined') {
          createOrderingGapAtTarget(
            store.value,
            sortedProperties.value,
            targetOrder,
            newProperties.length,
          )
          addNewPropertiesAtTarget(targetOrder, newProperties)
        } else {
          const maxOrder = getMaxOrder(sortedProperties.value)
          addNewPropertiesAtTarget(maxOrder + 1, newProperties)
        }

        return
      }

      // Moving existing properties
      if (typeof targetOrder !== 'undefined') {
        const draggingElements = getDraggingExistingProperties(dropStore)
        if (draggingElements.length === 0) return

        const draggingOrders = draggingElements.map((el) => el.order)
        const minDraggingOrder = Math.min(...draggingOrders)
        const numDragging = draggingElements.length
        const isMovingDown = minDraggingOrder < targetOrder

        createOrderingGapForExisting(
          store.value,
          sortedProperties.value,
          draggingElements,
          targetOrder,
        )

        const targetOrderWithOffset = isMovingDown ? targetOrder - numDragging + 1 : targetOrder
        addExistingPropertiesAtTarget(store.value, targetOrderWithOffset, draggingElements)
      }
    },
  },
})
</script>

<template>
  <PropertiesList>
    <ul ref="dropzoneRef" class="space-y-2">
      <template v-for="property in sortedProperties" :key="property.value.value">
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
