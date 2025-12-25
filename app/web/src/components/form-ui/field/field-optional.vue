<script setup lang="ts" generic="T">
import { AddButton } from '@/components/form-ui/buttons'
import { computed, getCurrentInstance, nextTick, useTemplateRef } from 'vue'
import type { FocusElement } from './'

const props = defineProps<{
  create: () => T
  focusElement?: FocusElement
}>()

const value = defineModel<T | undefined>({ required: true })

const focusElement = computed(() => props.focusElement ?? 'input')

const instance = getCurrentInstance()
const addButtonRef = useTemplateRef('addButton')

const handleAdd = () => {
  value.value = props.create()

  nextTick(() => {
    const $el = instance?.proxy?.$el ?? instance?.vnode.el
    $el?.nextElementSibling?.querySelector(focusElement.value)?.focus()
  })
}

const handleRemove = () => {
  value.value = undefined

  nextTick(() => {
    addButtonRef.value?.$el?.focus()
  })
}
</script>

<template>
  <AddButton v-if="typeof value === 'undefined'" ref="addButton" @click="handleAdd" />
  <slot v-else :remove="handleRemove" />
</template>
