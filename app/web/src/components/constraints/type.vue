<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupComboboxInput } from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
import { InputOptional } from '@/components/ui/input-optional'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

const datatype = ref<string | undefined>(undefined)
// @TODO: This does not work until we fix the InputList component
const classes = ref<Class[]>([])
const node = ref<string | undefined>(undefined)

type Class = {
  id: number
  value: string
}

let nextId = 0

const createClass = (): Class => ({
  id: nextId++,
  value: '',
})

const dataTypeOptions = [
  'xsd:string',
  'xsd:integer',
  'xsd:decimal',
  'xsd:float',
  'xsd:double',
  'xsd:boolean',
  'xsd:date',
  'xsd:time',
  'xsd:dateTime',
  'xsd:duration',
  'xsd:gYear',
  'xsd:gYearMonth',
  'xsd:gMonth',
  'xsd:gDay',
]

const classOptions = [
  'schema:Person',
  'schema:Organization',
  'schema:Place',
  'schema:Event',
  'schema:Thing',
  'schema:Object',
]
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
      <InputOptional v-model="datatype" :create="() => ''" v-slot="{ remove }">
        <Combobox v-model="datatype" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                @input="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    datatype = target.value
                  }
                "
                @blur="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    datatype = target.value
                  }
                "
              />

              <InputGroupAddon align="inline-end">
                <ComboboxTrigger />
                <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                  <XIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in dataTypeOptions" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span> {{ option }}</span>
                </div>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
          </ComboboxList>
        </Combobox>
      </InputOptional>
    </Field>

    <Field>
      <FieldLabel>
        Class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be a instance of the given class.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <InputList
        v-model="classes"
        :min="0"
        :create="createClass"
        :get-key="(entry: Class) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <Combobox v-model="entry.value" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                @input="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    entry.value = target.value
                  }
                "
                @blur="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    entry.value = target.value
                  }
                "
              />

              <InputGroupAddon align="inline-end">
                <ComboboxTrigger />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  color="danger"
                  v-if="isRemovable"
                  @click="remove"
                >
                  <XIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in classOptions" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span> {{ option }}</span>
                </div>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
          </ComboboxList>
        </Combobox>
      </InputList>
    </Field>
    <Field>
      <FieldLabel>
        Node
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must a specific node.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <InputOptional v-model="node" :create="() => ''" v-slot="{ remove }">
        <Combobox v-model="node" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                @input="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    node = target.value
                  }
                "
                @blur="
                  (e: Event) => {
                    const target = e.target as HTMLInputElement
                    node = target.value
                  }
                "
              />

              <InputGroupAddon align="inline-end">
                <ComboboxTrigger />
                <Button size="icon-sm" variant="ghost" color="danger" @click="remove">
                  <XIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in classOptions" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span> {{ option }}</span>
                </div>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
          </ComboboxList>
        </Combobox>
      </InputOptional>
    </Field>
  </Constraint>
</template>
