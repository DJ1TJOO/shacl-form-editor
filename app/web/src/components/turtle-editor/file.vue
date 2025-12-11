<script setup lang="ts">
import { injectFileContext } from '@/components/rdf'
import { TurtleEditor } from '@/components/turtle-editor'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-vue-next'

const { storedStore, isStoredStoreInvalid } = injectFileContext()
</script>

<template>
  <Tooltip>
    <TooltipTrigger
      :class="
        cn(
          'right-3 bottom-3 z-10 fixed flex justify-center items-center shadow-md p-1 rounded-full text-light',
          isStoredStoreInvalid ? 'bg-danger' : 'bg-success',
        )
      "
    >
      <component :is="isStoredStoreInvalid ? CircleAlertIcon : CircleCheckIcon" class="size-6" />
    </TooltipTrigger>
    <TooltipContent class="max-w-xs">
      {{ isStoredStoreInvalid ?? 'Valid file' }}
    </TooltipContent>
  </Tooltip>
  <TurtleEditor v-model="storedStore" />
</template>
