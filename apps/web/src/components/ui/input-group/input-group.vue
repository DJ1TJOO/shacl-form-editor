<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="input-group"
    role="group"
    :class="
      cn(
        'group/input-group relative flex items-center bg-background-highlighted shadow-xs rounded-sm outline-none w-full',
        'h-7 min-w-0 has-[>textarea]:h-auto',
        'transition-[color,box-shadow]',

        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

        'has-[[data-slot=input-group-control]:focus-visible]:ring-branding/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',

        'has-[[data-slot][aria-invalid=true]]:ring-danger/20 has-[[data-slot][aria-invalid=true]]:border-danger',

        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
