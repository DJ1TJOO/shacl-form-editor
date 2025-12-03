<script setup lang="ts">
import { injectPropertiesListContext } from '@/components/properties/list.vue'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, GripVerticalIcon, UngroupIcon, XIcon } from 'lucide-vue-next'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { ref, watch } from 'vue'

const props = defineProps<{
  label: string
}>()

const {
  target,
  Define: DefineOptions,
  isOpen: isOpenOptions,
} = useOptionsSidebar(Symbol('group-options'), 'Options for ' + props.label, {
  allowGrouping: false,
})

const isOpen = ref(true)
const { listOpen, indeterminate } = injectPropertiesListContext()
watch(listOpen, (newVal) => {
  if (newVal === 'indeterminate') return
  isOpen.value = newVal
})
watch(isOpen, (newVal) => {
  if (newVal === listOpen.value) return
  indeterminate()
})

const title = ref('')
</script>

<template>
  <DefineOptions>
    <InputGroup>
      <InputGroupInput v-model="title" placeholder="Group title" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          v-if="title"
          size="icon-sm"
          variant="ghost"
          color="danger"
          @click="title = ''"
        >
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <Button class="w-full" color="danger">
      <UngroupIcon />
      Ungroup properties
    </Button>
  </DefineOptions>
  <CollapsibleRoot
    ref="target"
    :class="
      cn(
        'mx-auto p-2 border-2 border-separator rounded-lg max-w-[calc(var(--container-md)+1rem+4px)]',
        isOpenOptions && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
    v-model:open="isOpen"
    :unmountOnHide="false"
  >
    <div class="flex justify-between items-center gap-2 px-2">
      <Button variant="ghost" size="icon">
        <GripVerticalIcon />
      </Button>

      <CollapsibleTrigger as-child class="group/property-collapsible-trigger">
        <h2
          class="flex justify-center justify-self-center items-center gap-1 w-fit font-bold text-branding"
        >
          {{ label }}
          <Button variant="ghost" size="icon">
            <ChevronDownIcon
              class="group-data-[state=open]/property-collapsible-trigger:-rotate-180 transition-transform"
            />
          </Button>
        </h2>
      </CollapsibleTrigger>
      <Button variant="ghost" size="icon" color="danger" class="justify-self-end"><XIcon /></Button>
    </div>
    <CollapsibleContent class="space-y-2 mt-1">
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
