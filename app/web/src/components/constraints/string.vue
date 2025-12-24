<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { RemoveButton } from '@/components/form-ui/buttons'
import { FieldOptional } from '@/components/form-ui/field'
import { LanguageSelect } from '@/components/form-ui/languages'
import { Shacl, Xsd } from '@/components/rdf'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { booleanFromCheckboxValue, useLiteral, useLiteralList } from '@/composables/use-shacl'
import { InfoIcon } from 'lucide-vue-next'
import { Literal } from 'rdflib'
import { computed } from 'vue'

const { subject, noLanguages = false } = defineProps<
  ConstraintProps & {
    noLanguages?: boolean
  }
>()

const { value: minLength } = useLiteral<number>({ subject, predicate: Shacl.SHACL('minLength') })
const { value: maxLength } = useLiteral<number>({ subject, predicate: Shacl.SHACL('maxLength') })
const { value: pattern } = useLiteral({ subject, predicate: Shacl.SHACL('pattern') })
const { value: combinedFlags } = useLiteral({ subject, predicate: Shacl.SHACL('flags') })
const { items: allowedLanguagesList } = useLiteralList({
  subject,
  predicate: Shacl.SHACL('languageIn'),
})
const { value: unique } = useLiteral<boolean>({ subject, predicate: Shacl.SHACL('uniqueLang') })

const flags = computed({
  get() {
    return combinedFlags.value?.split('') ?? []
  },
  set(value) {
    if (value.length === 0) {
      combinedFlags.value = undefined
    } else {
      combinedFlags.value = value.join('')
    }
  },
})
const hasPattern = computed(() => typeof pattern.value !== 'undefined')

const allowedLanguages = computed({
  get() {
    return allowedLanguagesList.map((language) => language.value)
  },
  set(value) {
    allowedLanguagesList.splice(
      0,
      allowedLanguagesList.length,
      ...value.map((language) => ({
        value: language,
        node: new Literal(language),
        datatype: Xsd.string,
      })),
    )
  },
})
</script>

<template>
  <Constraint legend="String constraints" :collapsible="collapsible">
    <div class="gap-1 grid grid-cols-2">
      <Field>
        <FieldLabel>
          Minimum Length
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The minimum number of characters allowed.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldOptional v-model="minLength" :create="() => 1" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput
              v-model="minLength"
              :min="1"
              :max="maxLength"
              default-value="1"
              type="number"
            />
            <InputGroupAddon align="inline-end">
              <RemoveButton @click="remove" />
            </InputGroupAddon>
          </InputGroup>
        </FieldOptional>
      </Field>

      <Field>
        <FieldLabel>
          Maximum Length
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The maximum number of characters allowed.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldOptional v-model="maxLength" :create="() => minLength ?? 1" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="maxLength" type="number" :min="minLength ?? 1" />
            <InputGroupAddon align="inline-end">
              <RemoveButton @click="remove" />
            </InputGroupAddon>
          </InputGroup>
        </FieldOptional>
      </Field>
    </div>

    <Field class="gap-1 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Pattern
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>A regular expression that the string must match.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="hasPattern"> Flags </FieldLabel>
      </div>

      <FieldOptional v-model="pattern" :create="() => ''" v-slot="{ remove }">
        <div class="grid grid-cols-subgrid col-span-2">
          <InputGroup>
            <InputGroupInput v-model="pattern" placeholder="Pattern (e.g. [a-b])" />
            <InputGroupAddon align="inline-end">
              <RemoveButton
                @click="
                  () => {
                    remove()
                    flags = []
                  }
                "
              />
            </InputGroupAddon>
          </InputGroup>

          <Select v-model="flags" multiple>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Unset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="s">s</SelectItem>
              <SelectItem value="m">m</SelectItem>
              <SelectItem value="i">i</SelectItem>
              <SelectItem value="x">x</SelectItem>
              <SelectItem value="q">q</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FieldOptional>
    </Field>

    <Field class="gap-1 grid grid-cols-[1fr_auto]" v-if="!noLanguages">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Allowed Languages
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >Restrict the language tags that are allowed for this property.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <FieldLabel>
          Unique
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>Every language may only occur once.</TooltipContent>
          </Tooltip>
        </FieldLabel>
      </div>
      <div class="items-center grid grid-cols-subgrid col-span-2">
        <LanguageSelect v-model="allowedLanguages" multiple />
        <Checkbox
          :model-value="unique"
          @update:model-value="(value) => (unique = booleanFromCheckboxValue(value))"
          class="justify-self-center"
        />
      </div>
    </Field>
  </Constraint>
</template>
