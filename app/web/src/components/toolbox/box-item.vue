<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDraggable } from '@vue-dnd-kit/core'
import { InfoIcon } from 'lucide-vue-next'
import { computed, type Component } from 'vue'

interface Props {
  icon: Component
  label: string
}

const { label, create } = defineProps<
  Props & {
    create?: (order?: number) => void
  }
>()

const { elementRef: draggableRef, handleDragStart } = useDraggable({
  id: `toolbox-item-${label}`,
  data: computed(() => ({
    create,
  })),
  containerProps: {
    class:
      '[&_button]:w-64 [&_button]:bg-background [&_button]:p-1 [&_button_.toolbox-item-label]:[display:unset]',
  },
})
</script>

<template>
  <button
    class="group/toolbox-item flex justify-between items-center gap-2 hover:bg-background-highlighted disabled:opacity-50 rounded-sm transition-colors disabled:pointer-events-none"
    ref="draggableRef"
    @pointerdown="handleDragStart"
    @click="create?.()"
  >
    <span class="flex items-center gap-2">
      <span
        class="bg-background-blue group-hover/toolbox-item:bg-background-blue/70 p-1 rounded-sm text-branding transition-colors"
      >
        <component :is="icon" class="size-5" />
      </span>
      <span
        class="hidden group-data-[toolbox-open=true]/toolbox-items:[display:unset] toolbox-item-label"
      >
        {{ label }}
      </span>
    </span>
    <Tooltip>
      <TooltipTrigger
        class="hidden mr-1 size-5 text-separator group-data-[toolbox-open=true]/toolbox-items:[display:unset]"
      >
        <InfoIcon class="size-5" />
      </TooltipTrigger>
      <TooltipContent>
        <slot />
      </TooltipContent>
    </Tooltip>
  </button>
</template>
