<script setup lang="ts">
import { SideBar } from '@/components/side-bar'
import Bar from './bar.vue'
import { injectOptionsSidebarProviderContext } from './provider.vue'

const { isOpen } = injectOptionsSidebarProviderContext()
</script>

<template>
  <SideBar v-if="isOpen">
    <Bar />
  </SideBar>
</template>
