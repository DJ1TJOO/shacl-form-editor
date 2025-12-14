<script setup lang="ts">
import {
  AdditionalConstraints,
  CardinalityConstraints,
  PairConstraints,
  RootClassConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { Property, type PropertyProps } from '@/components/properties'
import Base from '@/components/properties/property/base-fields.vue'
import { Dash, Shacl } from '@/components/rdf'
import { FieldSeparator } from '@/components/ui/field'
import { useNamed, useNamedList } from '@/composables/use-shacl'
import { ListIndentIncreaseIcon } from 'lucide-vue-next'
import { computed, watch } from 'vue'

const { subject, order, groupOrder, groupSubject } = defineProps<PropertyProps>()
defineEmits<{
  (e: 'remove'): void
}>()

const { value: editor } = useNamed({ subject, predicate: Dash.DASH('editor') })
const { value: viewer } = useNamed({ subject, predicate: Dash.DASH('viewer') })
const { items: classes } = useNamedList({ subject, predicate: Shacl.SHACL('class') })
const { value: rootClass } = useNamed({ subject, predicate: Dash.DASH('rootClass') })

const hasClass = computed(() => classes.length > 0)
const hasRootClass = computed(() => typeof rootClass.value !== 'undefined')

const label = computed(() => {
  if (hasClass.value) return 'Instance select'
  if (hasRootClass.value) return 'SubClass'
  return 'Select'
})

watch([hasClass, hasRootClass], ([hasClassValue, hasRootClassValue]) => {
  if (hasClassValue) {
    editor.value = Dash.DASH('InstancesSelectEditor').value
    viewer.value = Dash.DASH('LabelViewer').value
  } else if (hasRootClassValue) {
    editor.value = Dash.DASH('SubClassEditor').value
    viewer.value = Dash.DASH('LabelViewer').value
  } else {
    editor.value = Dash.DASH('EnumSelectEditor').value
    viewer.value = Dash.DASH('LiteralViewer').value
  }
})
</script>

<template>
  <Property
    :icon="ListIndentIncreaseIcon"
    :label="label"
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
      <FieldSeparator />
      <RootClassConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <ValueConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <PairConstraints :subject="subject" collapsible noLessThan />
      <FieldSeparator />
      <ValidationConstraints :subject="subject" collapsible />
      <FieldSeparator />
      <AdditionalConstraints type="property" :subject="subject" />
    </template>

    <Base :subject="subject" />
  </Property>
</template>
