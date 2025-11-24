<script setup lang="ts">
import SFEFooter from '@/components/sfe-footer/index.vue'
import SFEHeader from '@/components/sfe-header/index.vue'
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
