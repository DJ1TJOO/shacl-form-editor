<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Dash } from '@/components/rdf'
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
      <AddButton
        v-if="typeof rootClass === 'undefined'"
        @click="rootClass = 'http://www.w3.org/2000/01/rdf-schema#Resource'"
      />
      <PrefixInput v-model="rootClass" v-else>
        <RemoveButton @click="rootClass = undefined" />
      </PrefixInput>
    </Field>
  </Constraint>
</template>
