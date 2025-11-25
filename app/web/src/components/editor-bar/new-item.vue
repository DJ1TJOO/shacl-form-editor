<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-vue-next'
</script>

<template>
  <Dialog>
    <DialogTrigger class="shrink-0">
      <BarItem>
        <PlusIcon class="size-4" />
        New Node or Property
      </BarItem>
    </DialogTrigger>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Basic dialog</DialogTitle>
        <DialogDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, quas nulla eveniet
          atque placeat veritatis cumque, tenetur at voluptatum accusamus illum minus totam minima
          explicabo nostrum quis cupiditate dicta a.
        </DialogDescription>
      </DialogHeader>
    </DialogScrollContent>
  </Dialog>
</template>
