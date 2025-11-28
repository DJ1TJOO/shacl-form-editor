<script setup lang="ts" generic="T">
import { Button } from '@/components/ui/button'
import { useVModel } from '@vueuse/core'
import type { Ref } from 'vue'

const props = defineProps<{
  modelValue?: T
  create: () => T
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value?: T): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
}) as Ref<T | undefined>
</script>

<template>
  <slot v-if="modelValue !== undefined" :remove="() => (modelValue = undefined)" />
  <div v-else>
    <Button
      size="sm"
      variant="outline"
      color="background-blue"
      @click="() => (modelValue = create())"
    >
      Add
    </Button>
  </div>
</template>
