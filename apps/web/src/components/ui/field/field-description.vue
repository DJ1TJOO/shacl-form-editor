<script setup lang="ts">
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p
    data-slot="field-description"
    :class="
      cn(
        'font-normal text-text-light text-xs leading-normal',
        'group-has-data-[orientation=horizontal]/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a:hover]:text-branding [&>a]:underline [&>a]:underline-offset-4',
        props.class,
      )
    "
  >
    <slot />
  </p>
</template>
