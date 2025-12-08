<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Shacl } from '@/components/rdf'
import { absoluteToPrefixed } from '@/components/tmp-prefixes'
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

const { subject } = defineProps<ConstraintProps>()

const { value: datatype } = useNamed({ subject, predicate: Shacl.SHACL('datatype') })
const classes = useNamedList({ subject, predicate: Shacl.SHACL('class') })
const { value: nodeKind } = useNamed({ subject, predicate: Shacl.SHACL('nodeKind') })
</script>

<template>
  <Constraint legend="Type constraints" :collapsible="collapsible">
    <Field>
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
      />
      <!-- @TODO: fix when on blur is called in the prefix input the value is set to undefined, this also happens when a user tries to click a option from the list -->
      <PrefixInput v-model="datatype" v-else>
        <RemoveButton @click="datatype = undefined" />
      </PrefixInput>
    </Field>

    <Field>
      <FieldLabel>
        Class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be a instance of the given class.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <PrefixInput v-for="(classEntry, index) in classes" :key="index" v-model="classEntry.value">
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
      />
      <Select v-model="nodeKind" v-else>
        <InputGroup>
          <InputGroupSelectTrigger>
            <SelectValue />
          </InputGroupSelectTrigger>
          <InputGroupAddon align="inline-end">
            <InputGroupSelectTriggerIcon />
            <RemoveButton @click="nodeKind = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <SelectContent>
          <SelectItem
            v-for="nodeKind in Shacl.nodeKinds"
            :key="nodeKind.value"
            :value="nodeKind.value"
          >
            {{ absoluteToPrefixed(nodeKind.value) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  </Constraint>
</template>
