<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import {
  CalendarClockIcon,
  CalendarIcon,
  CircleIcon,
  DiamondIcon,
  FileTextIcon,
  Link2Icon,
  ListIndentIncreaseIcon,
  ListTodoIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SquareIcon,
  TextCursorInputIcon,
  TypeIcon,
  TypeOutlineIcon,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed, ref } from 'vue'
import BoxItem from './box-item.vue'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const searchQuery = ref('')

interface ToolboxItem {
  icon: Component
  label: string
  tooltip: string
}

const items: ToolboxItem[] = [
  { icon: TypeIcon, label: 'Text field', tooltip: 'Add to library' },
  { icon: FileTextIcon, label: 'Text area', tooltip: 'Add to library' },
  { icon: TextCursorInputIcon, label: 'Combobox', tooltip: 'Add to library' },
  { icon: ListTodoIcon, label: 'True / False', tooltip: 'Add to library' },
  { icon: CalendarIcon, label: 'Date', tooltip: 'Add to library' },
  { icon: CalendarClockIcon, label: 'DateTime', tooltip: 'Add to library' },
  { icon: ListIndentIncreaseIcon, label: 'Select', tooltip: 'Add to library' },
  { icon: ListIndentIncreaseIcon, label: 'Instance select', tooltip: 'Add to library' },
  { icon: TypeOutlineIcon, label: 'Rich text', tooltip: 'Add to library' },
  { icon: SquareIcon, label: 'SubClassEditor?', tooltip: 'Add to library' },
  { icon: Link2Icon, label: 'URI', tooltip: 'Add to library' },
  { icon: DiamondIcon, label: 'Subnode', tooltip: 'Add to library' },
  { icon: CircleIcon, label: 'Subproperty', tooltip: 'Add to library' },
]

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return items
  }
  const query = searchQuery.value.toLowerCase().trim()
  return items.filter((item) => item.label.toLowerCase().includes(query))
})
</script>

<template>
  <div :class="cn('gap-2 grid bg-background p-2 rounded-lg', open ? 'w-full' : 'w-fit')">
    <div class="flex gap-1">
      <Button color="background-blue" size="icon" @click="$emit('update:open', !open)">
        <component :is="open ? PanelLeftCloseIcon : PanelLeftOpenIcon" />
      </Button>
      <Input v-if="open" v-model="searchQuery" placeholder="Search" />
    </div>

    <div class="group/toolbox-items gap-1 grid" :data-toolbox-open="open">
      <BoxItem
        v-for="item in filteredItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
      >
        {{ item.tooltip }}
      </BoxItem>
    </div>
  </div>
</template>
