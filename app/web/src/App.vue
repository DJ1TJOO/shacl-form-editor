<script setup lang="ts">
import { SFEFooter } from '@/components/sfe-footer'
import { SFEHeader } from '@/components/sfe-header'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <SFEHeader />

    <div class="flex-1 min-h-0">
      <RouterView />
    </div>

    <SFEFooter />
  </div>
</template>
