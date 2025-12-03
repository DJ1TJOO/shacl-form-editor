<script setup lang="ts">
import { TextField } from '@/components/properties'
import PropertiesList from '@/components/properties/list.vue'
import { Dash, injectFileContext } from '@/components/rdf'
import { useNodeProperties } from '@/composables/use-shacl'
import { BlankNode } from 'rdflib'

const { currentShape } = injectFileContext()
const { properties, removeProperty } = useNodeProperties({ subject: currentShape.namedNode })
</script>

<template>
  <PropertiesList>
    <template v-for="property in properties" :key="property.value">
      <TextField
        v-if="
          property.value instanceof BlankNode &&
          property.editor?.equals(Dash.DASH('TextFieldEditor'))
        "
        :subject="property.value"
        @remove="removeProperty(property.value)"
      />
    </template>
    <slot />
  </PropertiesList>
</template>
