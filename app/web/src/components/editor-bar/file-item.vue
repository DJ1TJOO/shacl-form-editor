<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { NamespaceManager } from '@/components/namespace'
import { injectFileContext } from '@/components/rdf'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const { resetFile } = injectFileContext()
const activeDialog = ref<null | 'namespace-manager'>(null)
</script>

<template>
  <DropdownMenu v-slot="{ open }">
    <DropdownMenuTrigger class="group shrink-0">
      <BarItem :active="open" class="text-branding">
        <span
          class="bg-background-blue group-hover:bg-background-blue/70 p-1 rounded-sm transition-colors"
        >
          <FileIcon class="size-5" />
        </span>
        MyShaclFile
      </BarItem>
    </DropdownMenuTrigger>

    <NamespaceManager
      :open="activeDialog === 'namespace-manager'"
      @update:open="(open) => (activeDialog = open ? 'namespace-manager' : null)"
    />

    <DropdownMenuContent class="ml-1 w-56" align="start">
      <DropdownMenuItem @click="activeDialog = 'namespace-manager'">
        Manage namespaces
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="resetFile">Reset File</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
