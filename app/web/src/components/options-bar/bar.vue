<script setup lang="ts">
import { SideBar, SideBarTitle } from '@/components/side-bar'
import { injectOptionsSidebarProviderContext } from './provider.vue'

const { isOpen, title, options, close } = injectOptionsSidebarProviderContext()
</script>

<template>
  <SideBar
    v-if="isOpen"
    child-class="space-y-2 bg-background p-2 rounded-lg min-h-full"
    data-slot="options-bar"
  >
    <!-- @TODO: Try using roving focus together with an active card -->
    <SideBarTitle @close="close">{{ title }}</SideBarTitle>
    <component v-if="options" :is="options" />
  </SideBar>
</template>
