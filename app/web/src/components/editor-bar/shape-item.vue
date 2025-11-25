<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { CircleIcon, DiamondIcon } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{
  to: string
  label: string
  type: 'node' | 'property'
}>()

const route = useRoute()

function isActive(path: string) {
  return path === route.path
}
</script>

<template>
  <RouterLink :to="to" class="shrink-0">
    <BarItem :active="isActive(to)" text-color="text">
      <component :is="type === 'node' ? DiamondIcon : CircleIcon" class="size-4" />
      {{ label }}
    </BarItem>
  </RouterLink>
</template>
