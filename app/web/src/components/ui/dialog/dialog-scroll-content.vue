<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import { DialogClose, DialogContent, DialogPortal, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import DialogOverlay from './dialog-overlay.vue'

const props = defineProps<
  DialogContentProps & {
    class?: HTMLAttributes['class']
    'aria-describedby'?: HTMLAttributes['aria-describedby']
  }
>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'aria-describedby')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="place-items-center grid overflow-y-auto">
      <DialogContent
        :class="
          cn(
            'z-50 relative gap-4 grid bg-background shadow-lg my-8 p-6 sm:rounded-lg w-full md:w-full max-w-lg duration-200',
            props.class,
          )
        "
        :aria-describedby="props['aria-describedby']"
        v-bind="forwarded"
        @pointer-down-outside="
          (event) => {
            const originalEvent = event.detail.originalEvent
            const target = originalEvent.target as HTMLElement
            if (
              originalEvent.offsetX > target.clientWidth ||
              originalEvent.offsetY > target.clientHeight
            ) {
              event.preventDefault()
            }
          }
        "
        @interact-outside.prevent
      >
        <slot />

        <DialogClose
          class="top-4 right-4 absolute hover:bg-background-highlighted p-0.5 rounded-md transition-colors"
        >
          <X class="w-4 h-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
