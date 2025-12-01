<script setup lang="ts">
import { injectPropertiesListContext } from '@/components/properties/list.vue'
import { Button } from '@/components/ui/button'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, GripVerticalIcon, type LucideIcon, XIcon } from 'lucide-vue-next'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { ref, watch } from 'vue'

const props = defineProps<{
  icon: LucideIcon
  label: string
  path: string
  inGroup?: boolean
}>()

const isOpen = ref(false)
const { listOpen, indeterminate } = injectPropertiesListContext()
watch(listOpen, (newVal) => {
  if (newVal === 'indeterminate') return
  isOpen.value = newVal
})
watch(isOpen, (newVal) => {
  if (newVal === listOpen.value) return
  indeterminate()
})

const {
  target,
  Define: DefineOptions,
  isOpen: isOpenOptions,
} = useOptionsSidebar(Symbol('property-options'), 'Options for ' + props.path, {
  allowGrouping: !props.inGroup,
})
</script>

<template>
  <DefineOptions>
    <slot name="options" />
  </DefineOptions>
  <!--  @TODO: id remove or change to something useful when components are based on data -->
  <CollapsibleRoot
    ref="target"
    :id="`property-${path}`"
    :class="
      cn(
        'bg-background mx-auto p-2 rounded-lg max-w-md',
        isOpenOptions && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
    default-open
    v-model:open="isOpen"
  >
    <div class="relative flex justify-between items-center gap-2">
      <Button variant="ghost" size="icon">
        <GripVerticalIcon />
      </Button>
      <p v-if="path" class="left-8 absolute text-text-lighter text-sm">
        {{ path }}
      </p>

      <CollapsibleTrigger as-child class="group/property-collapsible-trigger">
        <h2 class="flex justify-center justify-self-center items-center gap-1 w-fit">
          <component :is="icon" class="size-5" />
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
    <CollapsibleContent class="mt-1">
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
