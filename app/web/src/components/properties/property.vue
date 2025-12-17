<script setup lang="ts">
import type { PropertyProps } from '@/components/properties'
import { injectPropertiesListContext } from '@/components/properties/list/list.vue'
import {
  moveProperty,
  type DraggingExistingProperties,
} from '@/components/properties/list/ordering'
import { Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useFileStore, useNamed } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { useDraggable } from '@vue-dnd-kit/core'
import { watchIgnorable } from '@vueuse/core'
import { ChevronDownIcon, GripVerticalIcon, XIcon, type LucideIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed, nextTick, ref, toValue, watch } from 'vue'

const { groupOrder, groupSubject, subject, order } = defineProps<
  PropertyProps & {
    icon: LucideIcon
    label: string
  }
>()

defineEmits<{
  (e: 'remove'): void
}>()

const store = useFileStore()
const { node: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const localName = computed(
  () =>
    Shacl.getLocalName(path.value) ??
    (subject instanceof NamedNode ? Shacl.getLocalName(subject.value) : undefined),
)

const {
  target,
  Define: DefineOptions,
  isOpen: isOpenOptions,
} = useOptionsSidebar(
  Symbol('property-options-' + encodeURIComponent(subject.value)),
  computed(() => 'Options for ' + localName.value),
  {
    allowGrouping: typeof groupOrder === 'undefined',
  },
)

const isOpen = ref(false)
const { listOpen, indeterminate } = injectPropertiesListContext()
const wasLastSetByOptions = ref(false)

watch(listOpen, (newListOpen) => {
  if (newListOpen === 'indeterminate' || newListOpen === 'groups') return
  ignoreIsOpenUpdates(() => {
    wasLastSetByOptions.value = false
    isOpen.value = newListOpen
  })
})

watch(isOpenOptions, (newIsOpenOptions) => {
  ignoreIsOpenUpdates(() => {
    if (newIsOpenOptions && !isOpen.value) {
      wasLastSetByOptions.value = true
      isOpen.value = true
    } else if (wasLastSetByOptions.value && isOpen.value) {
      wasLastSetByOptions.value = false
      isOpen.value = false
    }
  })
})

const { ignoreUpdates: ignoreIsOpenUpdates } = watchIgnorable(isOpen, (newVal) => {
  wasLastSetByOptions.value = false

  if (newVal === listOpen.value) return
  indeterminate()
})

const propertyId = computed(() => {
  const pathValue = toValue(path)
  if (!pathValue) return undefined
  return `property-${encodeURIComponent(pathValue.value)}`
})
const { elementRef: draggableRef, handleDragStart } = useDraggable({
  id: propertyId.value,
  data: computed<DraggingExistingProperties>(() => ({
    subject,
    order,
    groupOrder,
    groupSubject,
  })),
  containerProps: {
    class: '',
  },
})

async function handleMoveProperty(offset: number) {
  moveProperty(store.value, subject, offset)

  if (!propertyId.value) return
  await nextTick()
  const propertyElement = document.getElementById(propertyId.value)
  const button = propertyElement?.querySelector('button[data-grip-button]') as HTMLButtonElement
  button?.focus()
}
</script>

<template>
  <DefineOptions>
    <slot name="options" />
  </DefineOptions>
  <li ref="draggableRef" class="list-none">
    <!--  @TODO: id remove or change to something useful when components are based on data -->
    <CollapsibleRoot
      ref="target"
      :id="propertyId"
      :data-subject="subject.value"
      :data-local-name="localName ?? label"
      default-open
      v-model:open="isOpen"
      :class="
        cn(
          'bg-background p-2 rounded-lg',
          isOpenOptions && 'outline-solid outline-2 outline-complementary -outline-offset-2',
        )
      "
    >
      <div class="relative flex justify-between items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          data-grip-button
          data-prevent-activation
          @pointerdown="handleDragStart"
          @keydown.up.left.stop.prevent="() => handleMoveProperty(-1)"
          @keydown.down.right.stop.prevent="() => handleMoveProperty(1)"
        >
          <GripVerticalIcon />
        </Button>
        <p class="left-8 absolute text-text-lighter text-sm">
          {{ label }}
        </p>

        <h2 class="flex justify-center justify-self-center items-center gap-1 w-fit">
          <component :is="icon" class="size-5" />
          {{ localName }}
          <CollapsibleTrigger
            as-child
            class="group/property-collapsible-trigger"
            data-prevent-activation
          >
            <Button variant="ghost" size="icon">
              <ChevronDownIcon
                class="group-data-[state=open]/property-collapsible-trigger:-rotate-180 transition-transform"
              />
            </Button>
          </CollapsibleTrigger>
        </h2>
        <ConfirmDialog
          title="Remove"
          description="Are you sure you want to remove this property?"
          @confirm="
            () => {
              $emit('remove')
            }
          "
        >
          <Button
            variant="ghost"
            size="icon"
            color="danger"
            class="justify-self-end"
            data-prevent-activation
          >
            <XIcon />
          </Button>
        </ConfirmDialog>
      </div>
      <CollapsibleContent class="mt-1">
        <slot />
      </CollapsibleContent>
    </CollapsibleRoot>
  </li>
</template>
