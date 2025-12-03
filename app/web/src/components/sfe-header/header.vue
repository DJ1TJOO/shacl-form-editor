<script setup lang="ts">
import { ColoredSeparator } from '@/components/colored-separator'
import { injectHeaderProviderContext } from '@/components/sfe-header'

const { actions } = injectHeaderProviderContext()
</script>

<template>
  <header
    data-slot="header"
    class="flex justify-between items-center bg-background px-10 py-2 w-full"
  >
    <div class="flex flex-col text-branding">
      <h1 class="font-bold text-3xl leading-none">SHACL Form Editor</h1>
      <p class="leading-none tracking-wider">Build Validation Schemas Visually</p>
    </div>
    <div class="flex gap-2">
      <component :is="actions" />
    </div>
  </header>
  <ColoredSeparator data-slot="header-separator" />
</template>
