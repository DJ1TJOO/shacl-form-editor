<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldOptional } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Dash, RDF_CLASS_TYPES } from '@/components/rdf'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useNamed } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'

const { subject, collapsible } = defineProps<ConstraintProps>()
const { value: rootClass } = useNamed({ subject, predicate: Dash.DASH('rootClass') })
</script>

<template>
  <Constraint legend="Root class" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Root class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent
            >The root class from which subclasses can be selected. Permissible values are the given
            class or its subclasses.</TooltipContent
          >
        </Tooltip>
      </FieldLabel>
      <FieldOptional
        v-model="rootClass"
        :create="() => 'http://example.com/MyClass'"
        v-slot="{ remove }"
      >
        <PrefixInput v-model="rootClass" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldOptional>
    </Field>
  </Constraint>
</template>
