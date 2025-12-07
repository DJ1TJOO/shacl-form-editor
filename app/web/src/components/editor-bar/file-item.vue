<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { injectFileContext } from '@/components/rdf'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileIcon } from 'lucide-vue-next'

const { resetFile } = injectFileContext()
</script>

<template>
  <DropdownMenu v-slot="{ open }">
    <DropdownMenuTrigger class="group shrink-0">
      <BarItem :active="open" class="text-branding">
        <span
          class="bg-background-blue group-hover:bg-background-blue/70 p-1 rounded-sm transition-colors"
          ><FileIcon class="size-5"
        /></span>
        MyShaclFile
      </BarItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="ml-1 w-56" align="start">
      <DropdownMenuItem @click="resetFile"> Reset File </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
