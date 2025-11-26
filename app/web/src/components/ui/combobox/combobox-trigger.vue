<script setup lang="ts">
import { ChevronsUpDownIcon } from 'lucide-vue-next'
import { ComboboxTrigger, type ComboboxTriggerProps } from 'reka-ui'

defineProps<ComboboxTriggerProps>()
</script>

<template>
  <ComboboxTrigger>
    <slot>
      <ChevronsUpDownIcon class="size-4" />
    </slot>
  </ComboboxTrigger>
</template>
