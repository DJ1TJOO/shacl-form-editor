<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
import { InputOptional } from '@/components/ui/input-optional'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

const minLength = ref<number | undefined>(5)
const maxLength = ref<number | undefined>()

type PatternEntry = {
  id: number
  pattern: string
  flags: string
}

let nextPatternId = 0

const createPatternEntry = (): PatternEntry => ({
  id: nextPatternId++,
  pattern: '',
  flags: '',
})

const patterns = ref<PatternEntry[]>([])

const allowedLanguages = ref<string[] | undefined>()
const languageOptions = ['en', 'nl', 'de', 'fr']

const unique = ref<boolean | 'indeterminate'>(false)
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
        <InputOptional v-model="minLength" :create="() => 5" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="minLength" type="number" :min="0" :max="maxLength" />
            <InputGroupAddon align="inline-end">
              <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>

      <Field>
        <FieldLabel>
          Maximum Length
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>The maximum number of characters allowed.</TooltipContent>
          </Tooltip>
        </FieldLabel>
        <InputOptional v-model="maxLength" :create="() => minLength ?? 5" v-slot="{ remove }">
          <InputGroup>
            <InputGroupInput v-model="maxLength" type="number" :min="minLength ?? 0" />
            <InputGroupAddon align="inline-end">
              <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                <XIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </InputOptional>
      </Field>
    </div>

    <Field class="gap-1 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Pattern
          <Tooltip>
            <Tooltip>
              <TooltipTrigger><InfoIcon /></TooltipTrigger>
              <TooltipContent>A regular expression that the string must match.</TooltipContent>
            </Tooltip>
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="patterns.length > 0"> Flags </FieldLabel>
      </div>

      <InputList
        v-model="patterns"
        :min="0"
        :max="1"
        :create="createPatternEntry"
        :get-key="(entry: PatternEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <div class="grid grid-cols-subgrid col-span-2">
          <InputGroup>
            <InputGroupInput v-model="entry.pattern" placeholder="Pattern (e.g. [a-b])" />
            <InputGroupAddon align="inline-end">
              <Button
                size="icon-sm"
                variant="ghost"
                color="danger"
                type="button"
                v-if="isRemovable"
                @click="remove"
              >
                <XIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          <Select v-model="entry.flags">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Flags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none"> None </SelectItem>
              <SelectItem value="i"> i </SelectItem>
              <SelectItem value="m"> m </SelectItem>
              <SelectItem value="g"> g </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </InputList>
    </Field>

    <Field class="gap-1 grid grid-cols-[1fr_auto]">
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
      <InputOptional v-model="allowedLanguages" :create="() => []" v-slot="{ remove }">
        <div class="items-center grid grid-cols-subgrid col-span-2">
          <Select v-model="allowedLanguages" multiple>
            <InputGroup>
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <InputGroupAddon align="inline-end">
                <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                  <XIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <SelectContent>
              <SelectItem v-for="option in languageOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Checkbox v-model="unique" class="justify-self-center" />
        </div>
      </InputOptional>
    </Field>
  </Constraint>
</template>
