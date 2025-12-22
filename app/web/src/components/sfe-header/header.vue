<script setup lang="ts">
import { ColoredSeparator } from '@/components/colored-separator'
import { injectHeaderProviderContext } from '@/components/sfe-header'

const { actions } = injectHeaderProviderContext()
</script>

<template>
  <header
    data-slot="header"
    class="flex justify-between items-center gap-4 bg-background px-10 py-2 w-full"
  >
    <router-link to="/" class="flex flex-col text-branding shrink-0">
      <h1 class="font-bold text-3xl leading-none">SHACL Form Editor</h1>
      <p class="leading-none tracking-wider">Build Validation Schemas Visually</p>
    </router-link>
    <component :is="actions" />
  </header>
  <ColoredSeparator data-slot="header-separator" />
</template>
