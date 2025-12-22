<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { DeleteFileDialog, NewFileDialog, RenameFileDialog, useFile } from '@/components/file'
import { NamespaceManager } from '@/components/namespace'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ClipboardListIcon,
  FileIcon,
  FilesIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { file, fileId } = useFile()

const activeDialog = ref<null | 'namespace-manager' | 'delete-file' | 'rename-file' | 'new-file'>(
  null,
)
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
        {{ file.name }}
      </BarItem>
    </DropdownMenuTrigger>

    <NamespaceManager
      :open="activeDialog === 'namespace-manager'"
      @update:open="(open) => (activeDialog = open ? 'namespace-manager' : null)"
    />

    <DeleteFileDialog
      :open="activeDialog === 'delete-file'"
      @update:open="(open) => (activeDialog = open ? 'delete-file' : null)"
      :fileId="fileId"
      :fileName="file.name"
    />

    <NewFileDialog
      :open="activeDialog === 'new-file'"
      @update:open="(open) => (activeDialog = open ? 'new-file' : null)"
    />

    <RenameFileDialog
      :open="activeDialog === 'rename-file'"
      @update:open="(open) => (activeDialog = open ? 'rename-file' : null)"
      :fileId="fileId"
      :fileName="file.name"
      redirectOnRename
    />

    <DropdownMenuContent class="ml-1 w-56" align="start">
      <DropdownMenuItem @click="activeDialog = 'rename-file'">
        <PencilIcon /> Rename
      </DropdownMenuItem>
      <DropdownMenuItem @click="activeDialog = 'namespace-manager'">
        <ClipboardListIcon /> Manage namespaces
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="router.push('/')"> <FilesIcon /> All files </DropdownMenuItem>
      <DropdownMenuItem @click="activeDialog = 'new-file'">
        <PlusIcon /> New file
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="danger" @click="activeDialog = 'delete-file'">
        <TrashIcon /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
