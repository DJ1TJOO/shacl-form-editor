<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import type { InputGroupButtonProps } from '.'

const props = defineProps<InputGroupButtonProps>()
</script>

<template>
  <Button :variant="props.variant" :color="props.color" :size="props.size" :class="cn(props.class)">
    <slot />
  </Button>
</template>
