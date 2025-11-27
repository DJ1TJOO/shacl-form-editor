<script setup lang="ts">
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from 'lucide-vue-next'
import { CollapsibleTrigger } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <CollapsibleTrigger
    data-slot="field-set-trigger"
    :class="cn('group/field-set-collapsible-trigger relative w-full text-left', props.class)"
  >
    <slot />
    <ChevronDownIcon
      class="top-0 right-0 absolute size-5 text-branding group-data-[state=open]/field-set-collapsible-trigger:-rotate-180 transition-transform"
    />
  </CollapsibleTrigger>
</template>
