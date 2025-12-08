<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Label
    data-slot="field-label"
    :class="
      cn(
        'text-text-lighter text-xs',
        'group/field-label peer/field-label flex gap-1 w-fit leading-snug',
        'group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        'has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border',
        '*:data-[slot=field]:p-4',
        'has-data-[state=checked]:bg-branding/5 has-data-[state=checked]:border-branding',
        `[&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-text-lighter [&_svg:not([class*='size-'])]:size-3`,
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
