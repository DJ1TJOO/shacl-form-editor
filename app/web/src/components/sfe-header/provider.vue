<script lang="ts">
import type { ReuseTemplateComponent } from '@vueuse/core'
import { createContext } from 'reka-ui'
import type { ShallowRef } from 'vue'

interface HeaderProviderContext {
  actions: ShallowRef<
    ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>> | undefined
  >
}

export const [injectHeaderProviderContext, provideHeaderProviderContext] =
  createContext<HeaderProviderContext>('HeaderProvider')
</script>

<script setup lang="ts">
import { shallowRef } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const actions =
  shallowRef<ReuseTemplateComponent<Record<string, unknown>, Record<'default', undefined>>>()

provideHeaderProviderContext({ actions })
</script>

<template>
  <slot />
</template>
