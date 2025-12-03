<script setup lang="ts">
import { injectFileContext, Shacl } from '@/components/rdf'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const open = useVModel(props, 'open', emit, {
  passive: (props.open === undefined) as false,
})

const { store } = injectFileContext()
const preview = computed(() => {
  if (!store.value) return
  return Shacl.serialize(store.value)
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogScrollContent aria-describedby="preview of the generated schema in ttl format">
      <DialogHeader>
        <DialogTitle>Preview</DialogTitle>
      </DialogHeader>
      <DialogDescription class="overflow-x-auto">
        <pre>{{ preview }}</pre>
      </DialogDescription>
    </DialogScrollContent>
  </Dialog>
</template>
