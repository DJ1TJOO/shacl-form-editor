<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { CircleIcon, DiamondIcon } from 'lucide-vue-next'

defineProps<{
  open: boolean
  shape: 'node' | 'property'
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()
</script>

<template>
  <div class="bg-background p-2 rounded-lg">
    <template v-if="open">
      some text
      <br />
      <br />
      <br />
      <br />
      <br />
      some text
      <br />
      <br />
      <br />
      <br />
      <br />
      some text
      <br />
      <br />
      <br />
      <br />
      some text
    </template>
    <Button color="background-blue" size="icon" @click="$emit('update:open', !open)" v-else>
      <component :is="shape === 'node' ? DiamondIcon : CircleIcon" />
    </Button>
  </div>
</template>
