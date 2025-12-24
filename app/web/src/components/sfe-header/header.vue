<script setup lang="ts">
import { ColoredSeparator } from '@/components/colored-separator'
import { injectHeaderProviderContext } from '@/components/sfe-header'

const { actions } = injectHeaderProviderContext()
</script>

<template>
  <header
    data-slot="header"
    class="items-center gap-4 grid grid-cols-[1fr_1.5fr_1fr] bg-background px-4 lg:px-10 py-2 w-full"
  >
    <div class="max-lg:hidden">
      <router-link to="/" class="flex flex-col text-branding">
        <h1 class="font-bold text-3xl leading-none whitespace-nowrap">SHACL Form Editor</h1>
        <p class="leading-none tracking-wider whitespace-nowrap">
          Build Validation Schemas Visually
        </p>
      </router-link>
    </div>
    <component :is="actions" />
  </header>
  <ColoredSeparator data-slot="header-separator" />
</template>
