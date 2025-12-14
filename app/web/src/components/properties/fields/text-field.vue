<script setup lang="ts">
import {
  AdditionalConstraints,
  CardinalityConstraints,
  PairConstraints,
  RangeConstraints,
  StringConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { Property, type PropertyProps } from '@/components/properties'
import Base from '@/components/properties/fields/base.vue'
import { Dash, RDF, Shacl, Xsd } from '@/components/rdf'
import { FieldSeparator } from '@/components/ui/field'
import { useNamed } from '@/composables/use-shacl'
import { TypeIcon } from 'lucide-vue-next'
import { computed, watch } from 'vue'

const { subject, order, groupOrder, groupSubject } = defineProps<PropertyProps>()
defineEmits<{
  (e: 'remove'): void
}>()

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

const canHaveRangeConstraints = computed(() => {
  return !datatype.value || !Xsd.isString(datatype.value)
})
const canHaveStringConstraints = computed(() => {
  return !datatype.value || (!Xsd.isDecimal(datatype.value) && !Xsd.isInteger(datatype.value))
})
</script>

<template>
  <Property
    :icon="TypeIcon"
    label="Text Field"
    :subject="subject"
    :order="order"
    :groupOrder="groupOrder"
    :groupSubject="groupSubject"
    @remove="$emit('remove')"
  >
    <template #options>
      <CardinalityConstraints :subject="subject" />
      <FieldSeparator />
      <TypeConstraints :subject="subject" collapsible />
      <FieldSeparator v-if="canHaveStringConstraints" />
      <StringConstraints v-if="canHaveStringConstraints" :subject="subject" collapsible />
      <FieldSeparator v-if="canHaveRangeConstraints" />
      <RangeConstraints v-if="canHaveRangeConstraints" :subject="subject" collapsible />
      <FieldSeparator />
      <ValueConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <PairConstraints :subject="subject" collapsible :noLessThan="!canHaveRangeConstraints" />
      <FieldSeparator />
      <ValidationConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <AdditionalConstraints type="property" :subject="subject" />
    </template>

    <Base :subject="subject" />
  </Property>
</template>
