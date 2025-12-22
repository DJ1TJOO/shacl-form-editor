<script setup lang="ts">
import { injectHeaderProviderContext } from '@/components/sfe-header/provider.vue'
import { createReusableTemplate } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'

const { actions } = injectHeaderProviderContext()
const [Define, Reuse] = createReusableTemplate()

onMounted(() => {
  actions.value = Reuse
})
onUnmounted(() => {
  actions.value = undefined
})
</script>

<template>
  <Define>
    <slot />
  </Define>
</template>
