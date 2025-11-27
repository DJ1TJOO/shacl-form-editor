<script setup lang="ts" generic="T">
import { Button } from '@/components/ui/button'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: T[]
  min?: number
  max?: number
  createEntry: () => T
  getKey: (entry: T, index: number) => string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T[]): void
}>()

const minEntries = computed(() => props.min ?? 0)
const maxEntries = computed(() => props.max ?? Infinity)
const entries = computed(() => props.modelValue ?? [])

const canAdd = computed(() => entries.value.length < maxEntries.value)
const canRemove = computed(() => entries.value.length > minEntries.value)

const handleAdd = () => {
  if (!canAdd.value) return
  const create = props.createEntry
  emit('update:modelValue', [...entries.value, create()])
}

const handleRemove = (index: number) => {
  if (!canRemove.value) return
  const next = [...entries.value]
  next.splice(index, 1)
  emit('update:modelValue', next)
}
</script>

<template>
  <slot
    v-for="(entry, index) in entries"
    :key="getKey(entry, index)"
    :entry="entry"
    :index="index"
    :remove="() => handleRemove(index)"
    :is-removable="canRemove"
  />

  <div v-if="canAdd">
    <Button size="sm" variant="outline" color="background-blue" @click="handleAdd"> Add </Button>
  </div>
</template>
