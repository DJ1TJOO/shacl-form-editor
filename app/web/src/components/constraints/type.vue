<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { useFile } from '@/components/file'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
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

      <AddButton
        v-if="typeof datatype === 'undefined'"
        @click="datatype = 'http://www.w3.org/2001/XMLSchema#string'"
        :disabled="fixedDatatype"
      />
      <!-- @TODO: fix when on blur is called in the prefix input the value is set to undefined, this also happens when a user tries to click a option from the list -->
      <PrefixInput
        v-model="datatype"
        v-else
        :disabled="fixedDatatype"
        :types="[RDFS('Datatype').value]"
      >
        <RemoveButton @click="datatype = undefined" :disabled="fixedDatatype" />
      </PrefixInput>
    </Field>

    <Field v-if="!noClasses">
      <FieldLabel>
        Class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be a instance of the given class.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <PrefixInput
        v-for="(classEntry, index) in classes"
        :key="index"
        v-model="classEntry.value"
        :types="RDF_CLASS_TYPES"
      >
        <RemoveButton @click="classes.splice(index, 1)" />
      </PrefixInput>
      <AddButton @click="classes.push({ value: '', node: new NamedNode(':') })" />
    </Field>
    <Field>
      <FieldLabel>
        Node kind
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must a specific node.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <AddButton
        v-if="typeof nodeKind === 'undefined'"
        @click="nodeKind = Shacl.nodeKinds[0].value"
        :disabled="fixedNodeKind"
      />
      <Select v-model="nodeKind" v-else :disabled="fixedNodeKind">
        <InputGroup>
          <InputGroupSelectTrigger>
            <SelectValue />
          </InputGroupSelectTrigger>
          <InputGroupAddon align="inline-end">
            <InputGroupSelectTriggerIcon />
            <RemoveButton @click="nodeKind = undefined" :disabled="fixedNodeKind" />
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
    </Field>
  </Constraint>
</template>
