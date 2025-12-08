<script setup lang="ts">
import { Shacl } from '@/components/rdf'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useNamed } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import type { BlankNode } from 'rdflib/lib/tf-types'

const { subject } = defineProps<{
  subject: BlankNode
}>()

const { value: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const { value: label } = useLiteral({ subject, predicate: Shacl.SHACL('name') })
const { value: description } = useLiteral({
  subject,
  predicate: Shacl.SHACL('description'),
})
const { value: defaultValue } = useLiteral({
  subject,
  predicate: Shacl.SHACL('defaultValue'),
})
</script>

<template>
  <FieldSet>
    <FieldGroup>
      <Field>
        <FieldLabel>
          Path
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <Input v-model="path" placeholder="ex:path" />
      </Field>
      <Field>
        <FieldLabel>
          Label
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <Input v-model="label" />
      </Field>
      <Field>
        <FieldLabel>
          Description
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <Textarea v-model="description" />
      </Field>

      <Field>
        <FieldLabel>
          Default Value
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <Input v-model="defaultValue" />
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
