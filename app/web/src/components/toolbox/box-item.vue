<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-vue-next'
import { type Component } from 'vue'

interface Props {
  icon: Component
  label: string
}

defineProps<Props>()
</script>

<template>
  <button
    class="group flex justify-between items-center gap-2 hover:bg-background-highlighted rounded-sm transition-colors"
  >
    <span class="flex items-center gap-2">
      <span
        class="bg-background-blue group-hover:bg-background-blue/70 p-1 rounded-sm text-branding transition-colors"
      >
        <component :is="icon" class="size-5" />
      </span>
      <span class="hidden group-data-[toolbox-open=true]/toolbox-items:[display:unset]">{{
        label
      }}</span>
    </span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          class="hidden mr-1 size-5 text-separator group-data-[toolbox-open=true]/toolbox-items:[display:unset]"
          ><InfoIcon class="size-5"
        /></TooltipTrigger>
        <TooltipContent>
          <slot />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </button>
</template>
