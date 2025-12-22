<script setup lang="ts">
import { Files, useFile } from '@/components/file'
import { TurtleEditor } from '@/components/turtle-editor'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const { file, fileInStorage, deserializationError } = useFile()
const store = computed({
  get() {
    return file.value.store
  },
  set(value) {
    fileInStorage.value = Files.serializeFile({
      ...file.value,
      store: value,
      updated: new Date().toISOString(),
    })
  },
})
</script>

<template>
  <Tooltip>
    <TooltipTrigger
      :class="
        cn(
          'right-3 bottom-3 z-10 fixed flex justify-center items-center shadow-md p-1 rounded-full text-light',
          deserializationError ? 'bg-danger' : 'bg-success',
        )
      "
    >
      <component :is="deserializationError ? CircleAlertIcon : CircleCheckIcon" class="size-6" />
    </TooltipTrigger>
    <TooltipContent class="max-w-xs">
      {{ deserializationError ?? 'Valid file' }}
    </TooltipContent>
  </Tooltip>
  <TurtleEditor v-model="store" />
</template>
