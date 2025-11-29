<script lang="ts">
import type { ReuseTemplateComponent } from '@vueuse/core'
import { createContext } from 'reka-ui'
import type { Ref, ShallowRef } from 'vue'

interface OptionsSidebarProviderContext {
  open: (
    title: string,
    template: ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>,
  ) => void
  close: () => void

  isOpen: Ref<boolean>
  title: Ref<string>
  options: ShallowRef<
    ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>> | undefined
  >
}

export const [injectOptionsSidebarProviderContext, provideOptionsSidebarProviderContext] =
  createContext<OptionsSidebarProviderContext>('OptionsSidebarProvider')
</script>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const isOpen = ref(false)
const title = ref('')
const options =
  shallowRef<ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>>()

function open(
  newTitle: string,
  template: ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>,
) {
  title.value = newTitle
  options.value = template
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

provideOptionsSidebarProviderContext({
  open,
  close,
  isOpen,
  title,
  options,
})

defineExpose({
  isOpen,
})
</script>

<template>
  <slot />
</template>
