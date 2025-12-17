<script setup lang="ts">
import { NewItemDialog } from '@/components/editor-bar'
import BarItem from '@/components/editor-bar/bar-item.vue'
import { PlusIcon } from 'lucide-vue-next'
</script>

<template>
  <NewItemDialog>
    <BarItem>
      <PlusIcon class="size-4" />
      New shape
    </BarItem>
  </NewItemDialog>
</template>
