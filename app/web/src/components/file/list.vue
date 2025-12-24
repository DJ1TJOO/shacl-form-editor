<script setup lang="ts">
import { DeleteFileDialog, Files, NewFileDialog, RenameFileDialog } from '@/components/file'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const files = Files.useFiles()
const sortedFiles = computed(() =>
  files.value.toSorted((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
)

const activeDialog = ref<null | 'rename-file' | 'delete-file'>(null)
const activeFile = ref<Files.FileWithId | null>(null)

function openRenameFileDialog(file: Files.FileWithId) {
  activeFile.value = file
  activeDialog.value = 'rename-file'
}

function openDeleteFileDialog(file: Files.FileWithId) {
  activeFile.value = file
  activeDialog.value = 'delete-file'
}
</script>

<template>
  <DeleteFileDialog
    v-if="activeFile"
    :open="activeDialog === 'delete-file'"
    @update:open="(open) => (activeDialog = open ? 'delete-file' : null)"
    :fileId="activeFile.id"
    :fileName="activeFile.name"
  />

  <RenameFileDialog
    v-if="activeFile"
    :open="activeDialog === 'rename-file'"
    @update:open="(open) => (activeDialog = open ? 'rename-file' : null)"
    :fileId="activeFile.id"
    :fileName="activeFile.name"
  />

  <div v-if="sortedFiles.length === 0" class="flex flex-col justify-center items-center gap-2">
    <p class="text-text text-center">No files found</p>
    <NewFileDialog>
      <Button size="lg"><PlusIcon /> New File</Button>
    </NewFileDialog>
  </div>
  <ul v-else class="gap-2 grid @4xl/files-list:grid-cols-3 @xl/files-list:grid-cols-2">
    <li v-for="file in sortedFiles" :key="file.id">
      <ContextMenu>
        <ContextMenuTrigger>
          <RouterLink
            :to="`/file/${file.id}`"
            class="block bg-light p-1 pb-2 rounded-lg max-w-[calc(100vw-1.5rem)] size-full"
          >
            <span class="block bg-branding/10 p-2 rounded-sm h-28 text-xs">
              <code class="line-clamp-6 whitespace-pre">{{ file.store.trim() }}</code>
            </span>
            <span class="block mx-1 mt-2 font-bold text-branding">{{ file.name }}</span>
            <span class="block mx-1 text-text-light text-xs">
              Updated:
              {{
                new Date(file.updated).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
            <span class="block mx-1 text-text-light text-xs">
              Created:
              {{
                new Date(file.created).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
            <span class="block mx-1 text-text-light text-xs"> Stored as '{{ file.id }}' </span>
          </RouterLink>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem @click="openRenameFileDialog(file)">
            <PencilIcon /> Rename
          </ContextMenuItem>
          <ContextMenuItem variant="danger" @click="openDeleteFileDialog(file)">
            <TrashIcon /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  </ul>
</template>
