<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { CircleIcon, DiamondIcon, TrashIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  to: string
  label?: string
  type: 'node' | 'property'
}>()

defineEmits<{
  (e: 'removeShape'): void
  (e: 'click', event: PointerEvent): void
}>()

const route = useRoute()

function isActive(path: string) {
  return path === route.path
}

const isConfirmDialogOpen = ref(false)
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <a class="shrink-0" @click="$emit('click', $event)" type="button">
        <BarItem :active="isActive(to)" text-color="text">
          <component :is="type === 'node' ? DiamondIcon : CircleIcon" class="size-4" />
          {{ label }}
        </BarItem>
      </a>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem variant="danger" @click="isConfirmDialogOpen = true">
        <TrashIcon /> Remove
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  <ConfirmDialog
    v-model:open="isConfirmDialogOpen"
    title="Remove shape"
    :description="`Are you sure you want to remove the shape ${label}?`"
    @confirm="$emit('removeShape')"
  />
</template>
