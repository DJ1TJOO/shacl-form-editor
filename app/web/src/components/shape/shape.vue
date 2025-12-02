<script setup lang="ts">
import { AdditionalConstraints } from '@/components/constraints'
import { injectFileContext, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useLiteral } from '@/composables/use-rdf'
import { cn } from '@/lib/cn'
import { CircleIcon, DiamondIcon, InfoIcon, PanelRightOpenIcon, TypeIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const route = useRoute()
const { store } = injectFileContext()
const shape = computed(() =>
  store.value
    ? Shacl.findShapes(store.value).find((shape) => shape.name === route.params.shapeId)
    : undefined,
)
const node = computed(() => shape.value?.node)

const {
  target,
  Define: DefineOptions,
  open: openOptions,
  isOpen,
} = useOptionsSidebar(Symbol('shape-options'), 'Options for MyNode', { allowGrouping: false })

const label = useLiteral(node, Shacl.SHACL('name'))
const description = useLiteral(node, Shacl.SHACL('description'))
</script>

<template>
  <DefineOptions>
    <AdditionalConstraints />
  </DefineOptions>
  <div
    v-if="shape"
    :key="shape.name"
    ref="target"
    :id="shape.name"
    :class="
      cn(
        'bg-background p-2 rounded-lg',
        isOpen && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
  >
    <FieldSet v-if="open">
      <FieldLegend
        v-if="shape.type === 'property'"
        class="justify-center w-full font-normal text-text"
      >
        <TypeIcon />
        Text field
      </FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>
            IRI
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input :model-value="shape.node.value" placeholder="ex:MyNode" />
        </Field>
        <Field v-if="shape.type === 'property'">
          <FieldLabel>
            Path
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input placeholder="ex:path" />
        </Field>
        <Field>
          <FieldLabel>
            Label
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Input placeholder="My Node" v-model="label" />
        </Field>
        <Field>
          <FieldLabel>
            Description
            <Tooltip>
              <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </FieldLabel>
          <Textarea v-model="description" placeholder="This is a node with a description" />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Button v-if="open" color="background-blue" class="mt-2 w-full" @click="openOptions">
      <PanelRightOpenIcon /> Additional options
    </Button>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="shape.type === 'node' ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
