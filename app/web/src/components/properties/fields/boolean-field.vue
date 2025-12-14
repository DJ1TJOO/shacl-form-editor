<script setup lang="ts">
import {
  AdditionalConstraints,
  CardinalityConstraints,
  PairConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { Property, type PropertyProps } from '@/components/properties'
import Base from '@/components/properties/fields/base.vue'
import { FieldSeparator } from '@/components/ui/field'
import { ListTodoIcon } from 'lucide-vue-next'

const { subject, order, groupOrder, groupSubject } = defineProps<PropertyProps>()
defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <Property
    :icon="ListTodoIcon"
    label="True / False"
    :subject="subject"
    :order="order"
    :groupOrder="groupOrder"
    :groupSubject="groupSubject"
    @remove="$emit('remove')"
  >
    <template #options>
      <CardinalityConstraints :subject="subject" />
      <FieldSeparator />
      <TypeConstraints :subject="subject" collapsible fixedDatatype />
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
