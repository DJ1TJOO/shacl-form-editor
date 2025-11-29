<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { cn } from '@/lib/cn'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon, TypeIcon } from 'lucide-vue-next'
import { ref, useId, watch } from 'vue'

defineProps<{
  open: boolean
  shape: 'node' | 'property'
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const {
  target,
  Define: DefineOptions,
  open: openOptions,
  isOpen,
} = useOptionsSidebar('Options for MyNode')

const iriId = useId()
const labelId = useId()
const pathId = useId()
const descriptionId = useId()

const value = ref('')
watch(value, (value) => {
  console.log('input value', value)
})
</script>

<template>
  <DefineOptions>
    <p>test</p>
    <Input v-model="value" />
  </DefineOptions>
  <div
    data-activatable
    ref="target"
    :class="
      cn(
        'bg-background p-2 rounded-lg',
        isOpen && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
  >
    <FieldSet v-if="open">
      <FieldLegend v-if="shape === 'property'" class="justify-center w-full font-normal text-text">
        <TypeIcon />
        Text field
      </FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel :for="iriId">
            IRI
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input :id="iriId" placeholder="ex:MyNode" />
        </Field>
        <Field v-if="shape === 'property'">
          <FieldLabel :for="pathId">
            Path
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input :id="pathId" placeholder="ex:path" />
        </Field>
        <Field>
          <FieldLabel :for="labelId">
            Label
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input :id="labelId" placeholder="My Node" />
        </Field>
        <Field>
          <FieldLabel :for="descriptionId">
            Description
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Textarea :id="descriptionId" placeholder="This is a node with a description" />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button v-if="open" color="background-blue" class="mt-2 w-full" @click="openOptions">
      <PanelRightOpenIcon /> Additional options
    </Button>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="shape === 'node' ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
