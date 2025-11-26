<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import type { SeparatorProps } from 'reka-ui'
import { Separator } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'horizontal',
  decorative: true,
})

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Separator
    data-slot="separator"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-separator data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full shrink-0',
        props.class,
      )
    "
  />
</template>
