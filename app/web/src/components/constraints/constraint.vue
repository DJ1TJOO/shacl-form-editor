<script setup lang="ts">
import type { ConstraintProps } from '@/components/constraints'
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldSetCollapsible,
  FieldSetTrigger,
} from '@/components/ui/field'
import { CollapsibleContent } from 'reka-ui'

defineProps<ConstraintProps & { legend: string }>()
</script>

<template>
  <component :is="collapsible ? FieldSetCollapsible : FieldSet">
    <FieldSetTrigger v-if="collapsible">
      <FieldLegend>{{ legend }}</FieldLegend>
    </FieldSetTrigger>
    <component
      :is="collapsible ? CollapsibleContent : FieldGroup"
      :as="collapsible ? FieldGroup : undefined"
    >
      <slot />
    </component>
  </component>
</template>
