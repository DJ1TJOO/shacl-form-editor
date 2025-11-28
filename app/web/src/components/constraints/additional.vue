<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupComboboxInput,
} from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

// @TODO: This does not work until we fix the InputList component
const types = ref<
  {
    id: number
    value: string
  }[]
>([])

const nextId = 0

const closed = ref(false)

type IgnoredProperty = {
  id: number
  value: string
}

const ignoredProperties = ref<IgnoredProperty[]>([])

let nextIgnoredId = 0

const createIgnoredProperty = (): IgnoredProperty => ({
  id: nextIgnoredId++,
  value: '',
})

const typeOptions = [
  'schema:Person',
  'schema:Organization',
  'schema:Place',
  'schema:Event',
  'schema:Thing',
  'schema:Object',
]

const ignoredOptions = [
  'ex:FirstName',
  'ex:LastName',
  'ex:Email',
  'ex:Phone',
  'ex:Address',
  'ex:City',
  'ex:State',
  'ex:Zip',
  'ex:Country',
  'ex:Website',
  'ex:SocialMedia',
]
</script>

<template>
  <Constraint legend="Additional" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Type
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Additional RDF types.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <InputList
        v-model="types"
        :create="() => ({ id: nextId++, value: '' })"
        :get-key="(type) => type.id"
        v-slot="{ remove, entry, isRemovable }"
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
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  color="danger"
                  v-if="isRemovable"
                  @click="remove"
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in typeOptions" :key="option" :value="option">
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
        Closed
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>
            Whether this shape is closed. If checked, only explicitly defined properties are
            allowed.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <Checkbox v-model="closed" />
    </Field>

    <Field>
      <FieldLabel>
        Ignored properties
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>Properties that are ignored when the shape is closed.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <InputList
        v-model="ignoredProperties"
        :min="0"
        :create="createIgnoredProperty"
        :get-key="(entry: IgnoredProperty) => entry.id"
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
                placeholder="ex:FullName"
              />

              <InputGroupAddon align="inline-end">
                <ComboboxTrigger />
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  color="danger"
                  v-if="isRemovable"
                  @click="remove"
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in ignoredOptions" :key="option" :value="option">
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

    <!-- @TODO: Create something to add any rdf property -->
  </Constraint>
</template>
