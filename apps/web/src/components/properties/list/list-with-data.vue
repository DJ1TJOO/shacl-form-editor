<script setup lang="ts">
import { useFile } from '@/components/file'
import {
  BooleanProperty,
  ComboboxProperty,
  DateProperty,
  DateTimeProperty,
  Group,
  RichTextProperty,
  SelectProperty,
  SubNodeProperty,
  SubProperty,
  TextAreaProperty,
  TextFieldProperty,
  URIProperty,
} from '@/components/properties'
import Empty from '@/components/properties/list/empty.vue'
import PropertiesList from '@/components/properties/list/list.vue'
import {
  addExistingPropertiesAtTarget,
  addNewPropertiesAtTarget,
  createOrderingGapAtTarget,
  createOrderingGapForExisting,
  getDraggingExistingProperties,
  getDraggingNewProperties,
  getMaxOrder,
  getTargetOrder,
  recalculateOrdersForGroup,
  type DraggingExistingPropertiesInGroup,
  type DraggingExistingPropertiesNotInGroup,
} from '@/components/properties/list/ordering'
import { Dash } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { useDroppable } from '@vue-dnd-kit/core'
import { BlankNode, NamedNode, Node } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'
import { computed, type Component } from 'vue'

const propertyEditorTypes: {
  component: Component
  editor: (keyof typeof Dash.editors)[]
}[] = [
  {
    component: TextFieldProperty,
    editor: ['TextFieldEditor', 'TextFieldWithLangEditor'],
  },
  {
    component: TextAreaProperty,
    editor: ['TextAreaEditor', 'TextAreaWithLangEditor'],
  },
  {
    component: BooleanProperty,
    editor: ['BooleanSelectEditor'],
  },
  {
    component: DateProperty,
    editor: ['DatePickerEditor'],
  },
  {
    component: DateTimeProperty,
    editor: ['DateTimePickerEditor'],
  },
  {
    component: RichTextProperty,
    editor: ['RichTextEditor'],
  },
  {
    component: URIProperty,
    editor: ['URIEditor'],
  },
  {
    component: ComboboxProperty,
    editor: ['AutoCompleteEditor'],
  },
  {
    component: SelectProperty,
    editor: ['EnumSelectEditor', 'InstancesSelectEditor', 'SubClassEditor'],
  },
  {
    component: SubNodeProperty,
    editor: ['DetailsEditor'],
  },
] as const

const { currentShape, store } = useFile()
const { properties, removeProperty } = useNodeProperties({ subject: currentShape.node })

function getPropertyEditorType(property: {
  value: BlankNode | NamedNode
  editor: NamedNode | undefined
}) {
  if (property.value instanceof NamedNode) {
    return SubProperty
  }

  if (!property.editor) {
    return undefined
  }

  for (const type of propertyEditorTypes) {
    const editors = type.editor.map((editor) => Dash.editors[editor].value)
    if (editors.includes(property.editor.value)) {
      return type.component
    }
  }
  return undefined
}

const propertiesWithEditorType = computed(() =>
  properties.value.map((property) => {
    if (property.type === 'group') {
      return {
        ...property,
        properties: property.properties.map((prop) => ({
          ...prop,
          editorType: getPropertyEditorType(prop),
        })),
      }
    }

    return {
      ...property,
      editorType: getPropertyEditorType(property),
    }
  }),
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
            propertiesWithEditorType.value,
            targetOrder,
            newProperties.length,
          )
          addNewPropertiesAtTarget(targetOrder, newProperties)
        } else {
          const maxOrder = getMaxOrder(propertiesWithEditorType.value)
          addNewPropertiesAtTarget(maxOrder + 1, newProperties)
        }

        return
      }

      // Moving existing properties
      if (typeof targetOrder !== 'undefined') {
        const draggingElements = getDraggingExistingProperties(dropStore)
        if (draggingElements.length === 0) return

        const numDragging = draggingElements.length

        const allInGroup = draggingElements.every(
          (el): el is DraggingExistingPropertiesInGroup =>
            typeof el.groupOrder !== 'undefined' && typeof el.groupSubject !== 'undefined',
        )
        const allNotInGroup = draggingElements.every(
          (el): el is DraggingExistingPropertiesNotInGroup =>
            typeof el.groupOrder === 'undefined' || typeof el.groupSubject === 'undefined',
        )

        if (!allInGroup && !allNotInGroup) {
          throw new Error('Unsupported dragging: Dragging elements must all be in a group or not')
        }

        let isMovingDown = false
        let targetOrderWithOffset = targetOrder
        const groups: Set<Quad_Subject> = new Set()
        if (allInGroup) {
          const minGroupOrder = Math.min(
            ...draggingElements.map((el) => el.groupOrder ?? Number.MAX_SAFE_INTEGER),
          )
          isMovingDown = minGroupOrder < targetOrder
          targetOrderWithOffset = isMovingDown ? targetOrder - numDragging + 1 : targetOrder

          for (const element of draggingElements) {
            groups.add(element.groupSubject)
          }

          createOrderingGapAtTarget(
            store.value,
            propertiesWithEditorType.value,
            targetOrder,
            numDragging,
          )
        } else {
          const draggingOrders = draggingElements.map((el) => el.order)
          const minDraggingOrder = Math.min(...draggingOrders)
          isMovingDown = minDraggingOrder < targetOrder
          targetOrderWithOffset = isMovingDown ? targetOrder - numDragging + 1 : targetOrder
          createOrderingGapForExisting(
            store.value,
            propertiesWithEditorType.value,
            draggingElements,
            targetOrderWithOffset,
          )
        }

        addExistingPropertiesAtTarget(store.value, targetOrderWithOffset, draggingElements)
        for (const group of groups) {
          recalculateOrdersForGroup(store.value, group)
        }
      }
    },
  },
})
</script>

<template>
  <PropertiesList data-slot="properties">
    <ul ref="dropzoneRef" class="space-y-2">
      <template v-for="(property, index) in propertiesWithEditorType" :key="property.value.value">
        <component
          v-if="property.type === 'property' && property.editorType"
          :is="property.editorType"
          :subject="property.value"
          :order="property.order ? (Node.toJS(property.order) as number) : index"
          @remove="removeProperty(property.value)"
        />
        <template v-else-if="property.type === 'group'">
          <Group
            :subject="property.value"
            :order="property.order ? (Node.toJS(property.order) as number) : index"
            :properties="property.properties"
          >
            <template
              v-for="(subProperty, subIndex) in property.properties"
              :key="subProperty.value.value"
            >
              <component
                v-if="subProperty.editorType"
                :is="subProperty.editorType"
                :subject="subProperty.value"
                :order="subProperty.order ? (Node.toJS(subProperty.order) as number) : subIndex"
                :groupOrder="property.order ? (Node.toJS(property.order) as number) : index"
                :groupSubject="property.value"
                @remove="removeProperty(subProperty.value)"
              />
            </template>
          </Group>
        </template>
      </template>
      <slot />
      <Empty />
    </ul>
  </PropertiesList>
</template>
