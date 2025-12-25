<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { useFile } from '@/components/file'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldList, FieldOptional } from '@/components/form-ui/field'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Namespaces, Prefixes } from '@/components/namespace'
import { RDF_CLASS_TYPES, RDFS, Shacl } from '@/components/rdf'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupSelectTrigger,
  InputGroupSelectTriggerIcon,
} from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useNamed, useNamedList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'

const {
  subject,
  fixedDatatype,
  fixedNodeKind = false,
  noClasses = false,
  noDatatype = false,
} = defineProps<
  ConstraintProps & {
    fixedDatatype?: boolean
    fixedNodeKind?: boolean
    noClasses?: boolean
    noDatatype?: boolean
  }
>()
const { value: datatype } = useNamed({ subject, predicate: Shacl.SHACL('datatype') })
const { items: classes } = useNamedList({ subject, predicate: Shacl.SHACL('class') })
const { value: nodeKind } = useNamed({ subject, predicate: Shacl.SHACL('nodeKind') })

const { file } = useFile()
const namespaces = Namespaces.useActiveNamespacesDefinitions()
</script>

<template>
  <Constraint legend="Type constraints" :collapsible="collapsible">
    <Field v-if="!noDatatype">
      <FieldLabel>
        Datatype
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The type of data the property can hold.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <!-- @TODO: fix when on blur is called in the prefix input the value is set to undefined, this also happens when a user tries to click a option from the list -->
      <FieldOptional
        v-model="datatype"
        :create="() => 'http://www.w3.org/2001/XMLSchema#string'"
        v-slot="{ remove }"
      >
        <PrefixInput v-model="datatype" :disabled="fixedDatatype" :types="[RDFS('Datatype').value]">
          <RemoveButton @click="remove" :disabled="fixedDatatype" />
        </PrefixInput>
      </FieldOptional>
    </Field>

    <Field v-if="!noClasses">
      <FieldLabel>
        Class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be a instance of the given class.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldList
        v-slot="{ entry, remove }"
        v-model="classes"
        :create="() => ({ value: '', node: new NamedNode(':') })"
      >
        <PrefixInput v-model="entry.value" :types="RDF_CLASS_TYPES">
          <RemoveButton @click="remove" />
        </PrefixInput>
      </FieldList>
    </Field>
    <Field>
      <FieldLabel>
        Node kind
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must a specific node.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <FieldOptional
        v-model="nodeKind"
        :create="() => Shacl.nodeKinds[0].value"
        v-slot="{ remove }"
      >
        <Select v-model="nodeKind" :disabled="fixedNodeKind">
          <InputGroup>
            <InputGroupSelectTrigger>
              <SelectValue />
            </InputGroupSelectTrigger>
            <InputGroupAddon align="inline-end">
              <InputGroupSelectTriggerIcon />
              <RemoveButton @click="remove" :disabled="fixedNodeKind" />
            </InputGroupAddon>
          </InputGroup>
          <SelectContent>
            <SelectItem
              v-for="nodeKind in Shacl.nodeKinds"
              :key="nodeKind.value"
              :value="nodeKind.value"
            >
              {{ Prefixes.absoluteToPrefixed(namespaces, file.implicitBase, nodeKind.value) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FieldOptional>
    </Field>
  </Constraint>
</template>
