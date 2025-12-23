<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
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

      <template v-for="(classEntry, index) in targetClass" :key="index">
        <PrefixInput v-model="classEntry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="targetClass.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="targetClass.push({ value: '', node: new NamedNode(':') })" />
    </Field>

    <Field>
      <FieldLabel>
        Target node
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The specific node that is targeted by this shape.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <template v-for="(nodeEntry, index) in targetNode" :key="index">
        <PrefixInput v-model="nodeEntry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="targetNode.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="targetNode.push({ value: '', node: new NamedNode(':') })" />
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

      <template v-for="(subjectEntry, index) in targetSubjectsOf" :key="index">
        <PrefixInput v-model="subjectEntry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="targetSubjectsOf.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="targetSubjectsOf.push({ value: '', node: new NamedNode(':') })" />
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

      <template v-for="(objectEntry, index) in targetObjectsOf" :key="index">
        <PrefixInput v-model="objectEntry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="targetObjectsOf.splice(index, 1)" />
        </PrefixInput>
      </template>
      <AddButton @click="targetObjectsOf.push({ value: '', node: new NamedNode(':') })" />
    </Field>
  </Constraint>
</template>
