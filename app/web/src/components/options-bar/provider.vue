<script lang="ts">
import type { ReuseTemplateComponent } from '@vueuse/core'
import { createContext } from 'reka-ui'
import type { Ref, ShallowRef } from 'vue'

interface OptionsSidebarProviderContext {
  open: (
    id: symbol,
    title: string,
    template: ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>,
  ) => void
  close: (id?: symbol) => void

  isOpen: Ref<boolean>
  currentId: Ref<symbol | undefined>
  title: Ref<string>
  options: ShallowRef<
    ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>> | undefined
  >
}

export const [injectOptionsSidebarProviderContext, provideOptionsSidebarProviderContext] =
  createContext<OptionsSidebarProviderContext>('OptionsSidebarProvider')
</script>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const openId = ref<symbol | undefined>(undefined)
const isOpen = computed(() => typeof openId.value === 'symbol')
const title = ref('')
const options =
  shallowRef<ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>>()

function open(
  id: symbol,
  newTitle: string,
  template: ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>,
) {
  title.value = newTitle
  options.value = template
  openId.value = id
}

function close(id?: symbol) {
  if (id && id !== openId.value) return
  openId.value = undefined
}

provideOptionsSidebarProviderContext({
  open,
  close,
  isOpen,
  currentId: openId,
  title,
  options,
})

defineExpose({
  isOpen: openId,
})
</script>

<template>
  <slot />
</template>
