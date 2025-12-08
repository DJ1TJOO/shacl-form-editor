<script setup lang="ts">
import { injectOptionsSidebarProviderContext } from '@/components/options-bar'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  ADDED_TO_GROUP_EVENT,
  DEACTIVATE_GROUPED_EVENT,
  REMOVED_FROM_GROUP_EVENT,
} from '@/composables/use-active'
import { createReusableTemplate } from '@vueuse/core'
import { GroupIcon, XIcon } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

const id = Symbol('create-group')

const optionsSidebar = injectOptionsSidebarProviderContext()
const [Define, Reuse] = createReusableTemplate()

// @TODO: change to something useful when components are based on data
const groupedLabels = ref<string[]>([])

function open() {
  optionsSidebar.open(id, groupedLabels.value.join(', '), Reuse)
}

watch(optionsSidebar.currentId, (newId, oldId) => {
  if (newId !== undefined || oldId !== id) return
  window.dispatchEvent(new CustomEvent(DEACTIVATE_GROUPED_EVENT))
})

onMounted(() => {
  window.addEventListener(ADDED_TO_GROUP_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return

    groupedLabels.value.push(event.detail.id)
    open()
  })
  window.addEventListener(REMOVED_FROM_GROUP_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return

    groupedLabels.value = groupedLabels.value.filter((label) => label !== event.detail.id)
    if (groupedLabels.value.length === 0) {
      optionsSidebar.close(id)
    } else {
      open()
    }
  })
})

const title = ref('')
const inputRef = ref<HTMLInputElement>()

function handleCreate() {
  console.log('create group', title.value.trim())
}

function handleClear() {
  title.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <Define class="space-y-4">
    <InputGroup>
      <InputGroupInput
        ref="inputRef"
        v-model="title"
        placeholder="Group title"
        @keydown.enter="handleCreate"
      />
      <InputGroupAddon v-if="title" align="inline-end">
        <Button size="icon-sm" variant="ghost" color="danger" @click="handleClear">
          <XIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <Button class="w-full" :disabled="!title.trim()" @click="handleCreate">
      <GroupIcon />
      Create group
    </Button>
  </Define>
</template>
