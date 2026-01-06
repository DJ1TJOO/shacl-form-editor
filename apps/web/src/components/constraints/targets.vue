<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { RDF_CLASS_TYPES, Shacl } from '@/components/rdf'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useNamedList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'

const { subject } = defineProps<ConstraintProps>()

const { items: targetClass } = useNamedList({ subject, predicate: Shacl.SHACL('targetClass') })
// @TODO: targetNode should also allow for literals
const { items: targetNode } = useNamedList({ subject, predicate: Shacl.SHACL('targetNode') })
const { items: targetSubjectsOf } = useNamedList({
  subject,
  predicate: Shacl.SHACL('targetSubjectsOf'),
})
const { items: targetObjectsOf } = useNamedList({
  subject,
  predicate: Shacl.SHACL('targetObjectsOf'),
})
</script>

<template>
  <Constraint legend="Targets" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Target class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            All instances of the given class are targeted by this shape.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="targetClass"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>

    <Field>
      <FieldLabel>
        Target node
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The specific node that is targeted by this shape.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="targetNode"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>

    <Field>
      <FieldLabel>
        Target subjects of
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            All subjects of triples with the given predicate are targeted by this shape.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="targetSubjectsOf"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>

    <Field>
      <FieldLabel>
        Target objects of
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            All objects of triples with the given predicate are targeted by this shape.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="targetObjectsOf"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>
  </Constraint>
</template>
