<script setup lang="ts">
import { injectHeaderProviderContext } from '@/components/sfe-header/provider.vue'
import { createReusableTemplate } from '@vueuse/core'

const { actions } = injectHeaderProviderContext()
const [Define, Reuse] = createReusableTemplate()

actions.value = Reuse
</script>

<template>
  <Define>
    <slot />
  </Define>
</template>
