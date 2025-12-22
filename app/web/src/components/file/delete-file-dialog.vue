<script setup lang="ts">
import { Files } from '@/components/file'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

defineProps<{
  fileId: string
  fileName: string
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Delete file"
    :description="`Are you sure you want to delete the file '${fileName}'?`"
    @confirm="Files.deleteFile(fileId)"
  >
    <slot />
  </ConfirmDialog>
</template>
