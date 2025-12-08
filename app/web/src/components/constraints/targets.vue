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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<ConstraintProps>()

type TargetEntry = {
  id: number
  value: string
}

let nextId = 0

const createEntry = (): TargetEntry => ({
  id: nextId++,
  value: '',
})

const targetClass = ref<TargetEntry[]>([])
const targetNode = ref<TargetEntry[]>([])
const targetSubjectsOf = ref<TargetEntry[]>([])
const targetObjectsOf = ref<TargetEntry[]>([])

// Example options; users can always type custom values as well.
const options = [
  'ex:Person',
  'ex:Employee',
  'ex:Manager',
  'ex:Project',
  'ex:Task',
  'ex:Department',
  'ex:Location',
  'ex:Node1',
  'ex:Node2',
  'ex:createdBy',
  'ex:assignedTo',
  'ex:memberOf',
]
</script>

<template>
  <Constraint legend="Targets" :collapsible="collapsible">
    <Field>
      <FieldLabel>
        Target class
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent
            >All instances of the given class are targeted by this shape.</TooltipContent
          >
        </Tooltip>
      </FieldLabel>

      <InputList
        v-model="targetClass"
        :min="0"
        :create="createEntry"
        :get-key="(entry: TargetEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <Combobox v-model="entry.value" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                placeholder="ex:Person"
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
            <ComboboxEmpty>No results.</ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in options" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>{{ option }}</span>
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
        Target node
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The specific node that is targeted by this shape.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <InputList
        v-model="targetNode"
        :min="0"
        :create="createEntry"
        :get-key="(entry: TargetEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <Combobox v-model="entry.value" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                placeholder="ex:Alice"
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
            <ComboboxEmpty>No results.</ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in options" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>{{ option }}</span>
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
        Target subjects of
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent
            >All subjects of triples with the given predicate are targeted by this
            shape.</TooltipContent
          >
        </Tooltip>
      </FieldLabel>

      <InputList
        v-model="targetSubjectsOf"
        :min="0"
        :create="createEntry"
        :get-key="(entry: TargetEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <Combobox v-model="entry.value" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                placeholder="ex:createdBy"
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
            <ComboboxEmpty>No results.</ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in options" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>{{ option }}</span>
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
        Target objects of
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent
            >All objects of triples with the given predicate are targeted by this
            shape.</TooltipContent
          >
        </Tooltip>
      </FieldLabel>

      <InputList
        v-model="targetObjectsOf"
        :min="0"
        :create="createEntry"
        :get-key="(entry: TargetEntry) => entry.id"
        v-slot="{ entry, remove, isRemovable }"
      >
        <Combobox v-model="entry.value" :reset-search-term-on-blur="false">
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput
                placeholder="ex:assignedTo"
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
            <ComboboxEmpty>No results.</ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem v-for="option in options" :key="option" :value="option">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>{{ option }}</span>
                </div>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
          </ComboboxList>
        </Combobox>
      </InputList>
    </Field>
  </Constraint>
</template>
