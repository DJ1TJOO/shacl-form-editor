<script setup lang="ts">
import { CardinalityConstraints, TypeConstraints } from '@/components/constraints'
import { Property } from '@/components/properties'
import Base from '@/components/properties/base.vue'
import { Dash, RDF, Shacl } from '@/components/rdf'
import { FieldSeparator } from '@/components/ui/field'
import { useNamed } from '@/composables/use-shacl'
import { TypeIcon } from 'lucide-vue-next'
import type { BlankNode } from 'rdflib/lib/tf-types'
import { computed, watch } from 'vue'

const { subject } = defineProps<{
  subject: BlankNode
}>()
defineEmits<{
  (e: 'remove'): void
}>()

const { node: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const localName = computed(() => Shacl.getLocalName(path.value))

const { value: editor } = useNamed({ subject, predicate: Dash.DASH('editor') })
const { value: viewer } = useNamed({ subject, predicate: Dash.DASH('viewer') })
const { value: datatype } = useNamed({ subject, predicate: Shacl.SHACL('datatype') })
watch(datatype, (newDatatype) => {
  if (newDatatype === RDF('langString').value) {
    editor.value = Dash.DASH('TextFieldWithLangEditor').value
    viewer.value = Dash.DASH('LangStringViewer').value
  } else {
    editor.value = Dash.DASH('TextFieldEditor').value
    viewer.value = Dash.DASH('LiteralViewer').value
  }
})
</script>

<template>
  <Property :icon="TypeIcon" label="Text Field" :path="localName" @remove="$emit('remove')">
    <template #options>
      <CardinalityConstraints :subject="subject" />
      <FieldSeparator />
      <TypeConstraints :subject="subject" collapsible />
    </template>

    <Base :subject="subject" />
  </Property>
</template>
