<script setup lang="ts" generic="T">
import { AddButton } from '@/components/form-ui/buttons'
import { cn } from '@/lib/cn'
import { computed, nextTick, useTemplateRef, type HTMLAttributes } from 'vue'
import type { FocusElement } from './'

const props = defineProps<{
  create: () => T
  focusElement?: FocusElement
  min?: number
  max?: number
  class?: HTMLAttributes['class']
  listClass?: HTMLAttributes['class']
}>()

const entries = defineModel<T[]>({ required: true })

const focusElement = computed(() => props.focusElement ?? 'input')
const minEntries = computed(() => props.min ?? 0)
const maxEntries = computed(() => props.max ?? Infinity)

const canAdd = computed(() => entries.value.length < maxEntries.value)
const canRemove = computed(() => entries.value.length > minEntries.value)

const itemRefs = useTemplateRef('items')
const addButtonRef = useTemplateRef('addButton')

const handleAdd = () => {
  if (!canAdd.value) return
  const newEntry = props.create()
  entries.value.push(newEntry)

  nextTick(() => {
    const lastItem = itemRefs.value?.[itemRefs.value.length - 1]
    if (!lastItem) return
    lastItem.querySelector(focusElement.value)?.focus()
  })
}

const handleRemove = (index: number) => {
  if (!canRemove.value) return
  entries.value.splice(index, 1)

  nextTick(() => {
    const previousItem = itemRefs.value?.[index - 1]
    const nextItem = itemRefs.value?.[index]
    if (previousItem) {
      previousItem.querySelector(focusElement.value)?.focus()
    } else if (nextItem) {
      nextItem.querySelector(focusElement.value)?.focus()
    } else {
      addButtonRef.value?.$el?.focus()
    }
  })
}
</script>

<template>
  <ul :class="cn('space-y-0.5', props.listClass)">
    <li v-for="(entry, index) in entries" :key="index" ref="items" :class="props.class">
      <slot
        :entry="entry"
        :index="index"
        :remove="canRemove ? () => handleRemove(index) : undefined"
      />
    </li>
  </ul>
  <AddButton ref="addButton" v-if="canAdd" @click="handleAdd" />
</template>
