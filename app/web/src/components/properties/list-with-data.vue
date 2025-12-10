<script setup lang="ts">
import { TextAreaProperty, TextFieldProperty } from '@/components/properties'
import PropertiesList from '@/components/properties/list.vue'
import { Dash, injectFileContext } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { BlankNode, Node } from 'rdflib'
import { computed, type Component } from 'vue'

const { currentShape } = injectFileContext()
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
</script>

<template>
  <PropertiesList>
    <template v-for="property in sortedProperties" :key="property.value">
      <component
        v-if="property.type"
        :is="property.type"
        :subject="property.value"
        @remove="removeProperty(property.value)"
      />
    </template>
    <slot />
  </PropertiesList>
</template>
