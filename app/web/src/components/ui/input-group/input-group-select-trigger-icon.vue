<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { injectSelectRootContext, SelectIcon, type SelectTriggerProps } from 'reka-ui'

defineProps<SelectTriggerProps>()

const rootContext = injectSelectRootContext()

function handleClick() {
  rootContext.onOpenChange(true)
}
</script>

<template>
  <button @click="handleClick" tabindex="-1">
    <slot>
      <SelectIcon as-child>
        <ChevronDown class="size-4" />
      </SelectIcon>
    </slot>
  </button>
</template>
