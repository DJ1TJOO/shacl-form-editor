<script setup lang="ts">
import { SFEFooter } from '@/components/sfe-footer'
import { SFEHeader } from '@/components/sfe-header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RouterView } from 'vue-router'
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-col min-h-screen">
      <SFEHeader />

      <div class="flex-1 min-h-0">
        <RouterView />
      </div>

      <SFEFooter />
    </div>
  </TooltipProvider>
</template>
