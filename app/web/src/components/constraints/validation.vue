<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
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

const severity = ref<string | undefined>()
const deactivated = ref<string | undefined>()

type MessageEntry = {
  id: number
  language: string
  text: string
}

let nextMessageId = 0

const createMessageEntry = (): MessageEntry => ({
  id: nextMessageId++,
  language: 'en',
  text: '',
})

const messages = ref<MessageEntry[]>([createMessageEntry()])

const languageOptions = ['en', 'nl', 'de', 'fr']
const severityOptions = ['Unset', 'Violation', 'Warning', 'Info']
const deactivatedOptions = ['Unset', 'True', 'False']
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
      <Select v-model="severity">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Unset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in severityOptions" :key="option" :value="option">
            {{ option }}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>

    <Field>
      <FieldLabel>
        Deactivated
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent> Whether this constraint is currently deactivated. </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <Select v-model="deactivated">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Unset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in deactivatedOptions" :key="option" :value="option">
            {{ option }}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>

    <Field class="gap-1 grid grid-cols-[auto_1fr]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Message
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent>
              Human-readable validation messages in one or more languages.
            </TooltipContent>
          </Tooltip>
        </FieldLabel>
      </div>

      <InputList
        v-model="messages"
        :min="1"
        :create="createMessageEntry"
        :get-key="(entry: MessageEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <div class="grid grid-cols-subgrid col-span-2">
          <Select v-model="entry.language">
            <SelectTrigger class="w-full max-w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in languageOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>

          <InputGroup>
            <InputGroupInput v-model="entry.text" placeholder="Validation message" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                color="danger"
                type="button"
                v-if="isRemovable"
                @click="remove"
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </InputList>
    </Field>
  </Constraint>
</template>
