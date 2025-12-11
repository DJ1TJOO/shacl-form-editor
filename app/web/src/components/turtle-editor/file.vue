<script setup lang="ts">
import { injectFileContext } from '@/components/rdf'
import { TurtleEditor } from '@/components/turtle-editor'
import { cn } from '@/lib/cn'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-vue-next'

const { storedStore, isStoredStoreValid } = injectFileContext()
</script>

<template>
  <div
    :class="
      cn(
        'right-3 bottom-3 z-10 fixed flex justify-center items-center shadow-md p-1 rounded-full text-light',
        isStoredStoreValid ? 'bg-success' : 'bg-danger',
      )
    "
  >
    <component :is="isStoredStoreValid ? CircleCheckIcon : CircleAlertIcon" class="size-6" />
  </div>
  <TurtleEditor v-model="storedStore" />
</template>
