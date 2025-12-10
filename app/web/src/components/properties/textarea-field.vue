<script setup lang="ts">
import {
  AdditionalConstraints,
  CardinalityConstraints,
  PairConstraints,
  StringConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { Property } from '@/components/properties'
import Base from '@/components/properties/base.vue'
import { Dash, RDF, Shacl } from '@/components/rdf'
import { FieldSeparator } from '@/components/ui/field'
import { useNamed } from '@/composables/use-shacl'
import { FileTextIcon } from 'lucide-vue-next'
import type { BlankNode } from 'rdflib/lib/tf-types'
import { watch } from 'vue'

const { subject, order } = defineProps<{
  subject: BlankNode
  order: number
}>()
defineEmits<{
  (e: 'remove'): void
}>()

const { value: editor } = useNamed({ subject, predicate: Dash.DASH('editor') })
const { value: viewer } = useNamed({ subject, predicate: Dash.DASH('viewer') })
const { value: datatype } = useNamed({ subject, predicate: Shacl.SHACL('datatype') })
watch(datatype, (newDatatype) => {
  if (newDatatype === RDF('langString').value) {
    editor.value = Dash.DASH('TextAreaWithLangEditor').value
    viewer.value = Dash.DASH('LangStringViewer').value
  } else {
    editor.value = Dash.DASH('TextAreaEditor').value
    viewer.value = Dash.DASH('LiteralViewer').value
  }
})
</script>

<template>
  <Property
    :icon="FileTextIcon"
    label="Text Area"
    :subject="subject"
    :order="order"
    @remove="$emit('remove')"
  >
    <template #options>
      <CardinalityConstraints :subject="subject" />
      <FieldSeparator />
      <!-- @TODO: should not allow for non string datatypes, that are known -->
      <TypeConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <StringConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <ValueConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <PairConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <ValidationConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <AdditionalConstraints type="property" :subject="subject" />
    </template>

    <Base :subject="subject" />
  </Property>
</template>
