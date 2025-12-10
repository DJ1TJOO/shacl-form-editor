<script setup lang="ts">
import { injectPropertiesListContext } from '@/components/properties/list.vue'
import { Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { useNamed } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { useDraggable } from '@vue-dnd-kit/core'
import { ChevronDownIcon, GripVerticalIcon, type LucideIcon, XIcon } from 'lucide-vue-next'
import type { BlankNode } from 'rdflib/lib/tf-types'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed, ref, watch } from 'vue'

const { inGroup, subject, order } = defineProps<{
  icon: LucideIcon
  label: string
  subject: BlankNode
  order: number
  inGroup?: boolean
}>()

defineEmits<{
  (e: 'remove'): void
}>()

const { node: path } = useNamed({ subject, predicate: Shacl.SHACL('path') })
const localName = computed(() => Shacl.getLocalName(path.value))

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
} = useOptionsSidebar(Symbol('property-options'), 'Options for ' + localName.value, {
  allowGrouping: !inGroup,
})

const { elementRef: draggableRef, handleDragStart } = useDraggable({
  id: `property-${path.value?.value}`,
  data: computed(() => ({
    subject,
    order,
  })),
  containerProps: {
    class: '',
  },
})

// function setRef(ref: Element | import('vue').ComponentPublicInstance | null) {
//   const element = unrefElement(ref as Parameters<typeof unrefElement>[0])
//   if (element instanceof HTMLElement) {
//     target.value = element
//     elementRef.value = element
//   }
// }
</script>

<template>
  <DefineOptions>
    <slot name="options" />
  </DefineOptions>
  <li ref="draggableRef" class="list-none">
    <!--  @TODO: id remove or change to something useful when components are based on data -->
    <CollapsibleRoot
      ref="target"
      :id="`property-${path?.value}`"
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
        <Button variant="ghost" size="icon" @pointerdown="handleDragStart">
          <GripVerticalIcon />
        </Button>
        <p v-if="localName" class="left-8 absolute text-text-lighter text-sm">
          {{ localName }}
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
        <Button
          variant="ghost"
          size="icon"
          color="danger"
          class="justify-self-end"
          @click="
            () => {
              $emit('remove')
            }
          "
        >
          <XIcon />
        </Button>
      </div>
      <CollapsibleContent class="mt-1">
        <slot />
      </CollapsibleContent>
    </CollapsibleRoot>
  </li>
</template>
