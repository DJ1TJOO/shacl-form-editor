<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'

defineProps<{
  standalone?: boolean
}>()
</script>

<template>
  <Button
    :size="standalone ? 'icon' : 'icon-sm'"
    :variant="standalone ? 'default' : 'ghost'"
    :color="standalone ? 'danger-hover' : 'danger'"
  >
    <XIcon />
  </Button>
</template>
