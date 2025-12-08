<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { Button } from '@/components/ui/button'
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
import { InputGroup, InputGroupAddon, InputGroupComboboxInput } from '@/components/ui/input-group'
import { InputList } from '@/components/ui/input-list'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

// @TODO: This does not work until we fix the InputList component
const equals = ref<Equals[]>([])
const disjoint = ref<Disjoint[]>([])
const lessThan = ref<LessThan[]>([])

type Disjoint = {
  id: number
  value: string
}

type Equals = {
  id: number
  value: string
}

type LessThan = {
  id: number
  value: string
  equals: boolean
}

let nextId = 0

const createDisjoint = (): Disjoint => ({
  id: nextId++,
  value: '',
})

const createEquals = (): Equals => ({
  id: nextId++,
  value: '',
})

const createLessThan = (): LessThan => ({
  id: nextId++,
  value: '',
  equals: false,
})

const options = [
  'ex:FistName',
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
  'ex:SocialMedia',
]
</script>

<template>
  <Constraint legend="Pair constraints" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Equals
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The property value must be equal to all given properties.</TooltipContent>
        </Tooltip>
      </FieldLabel>
      <InputList
        v-model="equals"
        :min="0"
        :create="createEquals"
        :get-key="(entry: Equals) => entry.id"
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
              <ComboboxItem v-for="option in options" :key="option" :value="option">
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
        Disjoint
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent
            >The property value must be disjoint with all given properties.</TooltipContent
          >
        </Tooltip>
      </FieldLabel>
      <InputList
        v-model="disjoint"
        :min="0"
        :create="createDisjoint"
        :get-key="(entry: Disjoint) => entry.id"
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
              <ComboboxItem v-for="option in options" :key="option" :value="option">
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

    <Field class="gap-x-1 gap-y-0.5 grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-subgrid col-span-2">
        <FieldLabel>
          Less than
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The property value must be disjoint with all given properties.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <FieldLabel v-if="lessThan.length > 0"> or equals </FieldLabel>
      </div>
      <InputList
        v-model="lessThan"
        :min="0"
        :create="createLessThan"
        :get-key="(entry: LessThan) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <div class="items-center grid grid-cols-subgrid col-span-2">
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
                <ComboboxItem v-for="option in options" :key="option" :value="option">
                  <div class="flex items-center gap-2">
                    <ComboboxItemIndicator />
                    <span> {{ option }}</span>
                  </div>
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
            </ComboboxList>
          </Combobox>
          <Checkbox v-model="entry.equals" class="justify-self-center" />
        </div>
      </InputList>
    </Field>
  </Constraint>
</template>
