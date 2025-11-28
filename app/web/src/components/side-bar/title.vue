<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center gap-1">
    <Button size="icon" color="background-blue">
      <XIcon />
    </Button>
    <slot />
  </div>
</template>
