<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui'
import {
  ComboboxContent,
  ComboboxPortal,
  injectComboboxRootContext,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import ComboboxViewport from './combobox-viewport.vue'

const props = withDefaults(
  defineProps<
    ComboboxContentProps & { class?: HTMLAttributes['class']; hideWhenEmpty?: boolean }
  >(),
  {
    position: 'popper',
    align: 'center',
    sideOffset: 4,
    hideWhenEmpty: false,
  },
)
const emits = defineEmits<ComboboxContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'hideWhenEmpty')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const rootContext = injectComboboxRootContext()

const isEmpty = computed(() => rootContext.filterState.value.count > 0)
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent
      data-slot="combobox-list"
      v-bind="forwarded"
      :class="
        cn(
          'z-50 min-w-(--reka-popper-anchor-width) border border-background-highlighted rounded-sm bg-background text-text origin-(--reka-combobox-content-transform-origin) overflow-hidden shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          hideWhenEmpty && isEmpty && 'hidden',
          props.class,
        )
      "
    >
      <ComboboxViewport>
        <slot />
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxPortal>
</template>
