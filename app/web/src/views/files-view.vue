<script setup lang="ts">
import { FilesList, NewFileDialog } from '@/components/file'
import { NamespaceManager } from '@/components/namespace'
import { HeaderActions } from '@/components/sfe-header'
import { Button } from '@/components/ui/button'
import { WarnDialog } from '@/components/ui/warn-dialog'
import { useUrlSearchParams } from '@vueuse/core'
import { ClipboardListIcon, PlusIcon } from 'lucide-vue-next'

const params = useUrlSearchParams<{ fileNotFound?: string }>('history')
</script>

<template>
  <main class="@container/files-list mx-auto p-1 w-full max-w-5xl">
    <HeaderActions>
      <div class="flex max-lg:justify-center gap-2 max-lg:col-span-3 lg:col-start-3">
        <NamespaceManager>
          <Button size="lg" color="background-highlighted">
            <ClipboardListIcon /> Manage Namespaces
          </Button>
        </NamespaceManager>
        <NewFileDialog>
          <Button size="lg"><PlusIcon /> New File</Button>
        </NewFileDialog>
      </div>
    </HeaderActions>

    <WarnDialog
      :open="params.fileNotFound === '1'"
      @update:open="(open) => (params.fileNotFound = open ? '1' : undefined)"
      title="File not found"
      description="The file you are looking for does not exist."
    />

    <div class="flex justify-between items-center my-2">
      <h1 class="ml-2 text-branding text-2xl">Files</h1>
    </div>

    <FilesList />
  </main>
</template>
