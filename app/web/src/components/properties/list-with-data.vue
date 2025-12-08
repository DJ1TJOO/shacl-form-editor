<script setup lang="ts">
import { TextField } from '@/components/properties'
import PropertiesList from '@/components/properties/list.vue'
import { Dash, injectFileContext } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { BlankNode, Node } from 'rdflib'
import { computed } from 'vue'

const { currentShape } = injectFileContext()
const { properties, removeProperty } = useNodeProperties({ subject: currentShape.namedNode })
const sortedProperties = computed(() =>
  properties.value.toSorted((a, b) => {
    const orderA = a.order ? (Node.toJS(a.order) as number) : 0
    const orderB = b.order ? (Node.toJS(b.order) as number) : 0
    return orderA - orderB
  }),
)
</script>

<template>
  <PropertiesList>
    <template v-for="property in sortedProperties" :key="property.value">
      <TextField
        v-if="
          property.value instanceof BlankNode &&
          (property.editor?.equals(Dash.DASH('TextFieldEditor')) ||
            property.editor?.equals(Dash.DASH('TextFieldWithLangEditor')))
        "
        :subject="property.value"
        @remove="removeProperty(property.value)"
      />
    </template>
    <slot />
  </PropertiesList>
</template>
