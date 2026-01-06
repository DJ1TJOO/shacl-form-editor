<script setup lang="ts">
import { CollapsibleRoot } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import FieldSet from './field-set.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <CollapsibleRoot as-child>
    <FieldSet :class="props.class">
      <slot />
    </FieldSet>
  </CollapsibleRoot>
</template>
