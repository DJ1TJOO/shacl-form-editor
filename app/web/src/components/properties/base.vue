<script setup lang="ts">
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { LanguageSelect } from '@/components/form-ui/languages'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Shacl, Xsd } from '@/components/rdf'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useLiteralList, useNamed } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'
import type { BlankNode } from 'rdflib/lib/tf-types'

const { subject } = defineProps<{
  subject: BlankNode
}>()

const { value: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const { items: labels } = useLiteralList({ subject, predicate: Shacl.SHACL('name') })
const { items: descriptions } = useLiteralList({
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
        <PrefixInput v-model="path" placeholder="ex:path" />
      </Field>
      <Field class="gap-0.5 grid grid-cols-[1fr_--spacing(20)]">
        <div class="grid grid-cols-subgrid col-span-2">
          <FieldLabel>
            Label
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <FieldLabel v-if="labels.length > 0"> Language </FieldLabel>
        </div>
        <div
          class="grid grid-cols-subgrid col-span-2"
          v-for="(label, index) in labels"
          :key="index"
        >
          <InputGroup>
            <InputGroupInput v-model="label.value" placeholder="My Node" />
            <InputGroupAddon align="inline-end">
              <RemoveButton @click="labels.splice(index, 1)" />
            </InputGroupAddon>
          </InputGroup>
          <!-- @TODO: show we show error when the same language is used for multiple times -->
          <LanguageSelect v-model="label.language" />
        </div>
        <AddButton
          @click="
            labels.push({
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
          Description
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <div
          v-for="(description, index) in descriptions"
          :key="index"
          class="space-y-0.5 has-[+div]:mb-2"
        >
          <Textarea v-model="description.value" placeholder="This is a node with a description" />
          <div class="flex items-center gap-0.5">
            <div class="flex-1">
              <LanguageSelect v-model="description.language" />
            </div>
            <RemoveButton standalone @click="descriptions.splice(index, 1)" />
          </div>
        </div>
        <AddButton
          @click="
            descriptions.push({
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
          Default Value
          <Tooltip>
            <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <InputGroup v-if="typeof defaultValue === 'string'">
          <InputGroupInput v-model="defaultValue" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="defaultValue = undefined" />
          </InputGroupAddon>
        </InputGroup>
        <AddButton v-else @click="defaultValue = ''" />
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
