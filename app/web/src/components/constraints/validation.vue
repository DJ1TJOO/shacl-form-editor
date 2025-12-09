<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { LanguageSelect } from '@/components/form-ui/languages'
import { Shacl, Xsd } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupSelectTrigger,
  InputGroupSelectTriggerIcon,
} from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  booleanFromCheckboxValue,
  useLiteral,
  useLiteralList,
  useNamed,
} from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'

const { subject } = defineProps<ConstraintProps>()

const { value: severity } = useNamed({ subject, predicate: Shacl.SHACL('severity') })
const { value: deactivated } = useLiteral<boolean>({
  subject,
  predicate: Shacl.SHACL('deactivated'),
})
const { items: messages } = useLiteralList({
  subject,
  predicate: Shacl.SHACL('message'),
})

const severityOptions = [
  {
    value: Shacl.SHACL('Violation').value,
    label: 'Violation',
  },
  {
    value: Shacl.SHACL('Warning').value,
    label: 'Warning',
  },
  {
    value: Shacl.SHACL('Info').value,
    label: 'Info',
  },
] as const
</script>

<template>
  <Constraint legend="Validation" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Severity
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent> The severity of this constraint when it is violated. </TooltipContent>
        </Tooltip>
      </FieldLabel>

      <AddButton
        v-if="typeof severity === 'undefined'"
        @click="severity = severityOptions[0].value"
      />
      <Select v-model="severity" v-else>
        <InputGroup>
          <InputGroupSelectTrigger>
            <SelectValue />
          </InputGroupSelectTrigger>
          <InputGroupAddon align="inline-end">
            <InputGroupSelectTriggerIcon />
            <RemoveButton @click="severity = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <SelectContent>
          <SelectItem v-for="option in severityOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>

    <Field class="gap-0.5 grid grid-cols-[1fr_--spacing(20)]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Message
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >Human-readable validation messages in one or more languages.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="messages.length > 0"> Language </FieldLabel>
      </div>
      <div
        class="grid grid-cols-subgrid col-span-2"
        v-for="(message, index) in messages"
        :key="index"
      >
        <InputGroup>
          <InputGroupInput v-model="message.value" placeholder="My Node" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="messages.splice(index, 1)" />
          </InputGroupAddon>
        </InputGroup>
        <!-- @TODO: show we show error when the same language is used for multiple times -->
        <LanguageSelect v-model="message.language" />
      </div>
      <AddButton
        @click="
          messages.push({
            value: '',
            language: undefined,
            datatype: Xsd.string,
            node: new Literal(''),
          })
        "
      />
    </Field>

    <Field>
      <FieldLabel>
        Deactivated
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent> Whether this constraint is currently deactivated. </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <Checkbox
        :model-value="deactivated"
        @update:model-value="(value) => (deactivated = booleanFromCheckboxValue(value))"
      />
    </Field>
  </Constraint>
</template>
