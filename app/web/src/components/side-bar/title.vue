<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'

const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="flex items-center gap-1">
    <Button size="icon" color="background-blue" @click="emits('close')">
      <XIcon />
    </Button>
    <slot />
  </div>
</template>
