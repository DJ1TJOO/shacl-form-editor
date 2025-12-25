<script setup lang="ts">
import { SideBarTitle } from '@/components/side-bar'
import { injectOptionsSidebarProviderContext } from './provider.vue'

const { title, options, close } = injectOptionsSidebarProviderContext()
</script>

<template>
  <div class="space-y-3 bg-background p-2 rounded-lg min-h-full" data-slot="options-bar">
    <SideBarTitle @close="close">{{ title }}</SideBarTitle>
    <component v-if="options" :is="options" />
  </div>
</template>
