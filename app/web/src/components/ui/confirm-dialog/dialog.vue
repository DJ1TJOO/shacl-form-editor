<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

defineProps<{
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'update:open', value: boolean): void
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <DialogDescription>{{ description }}</DialogDescription>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="ghost">Close</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button color="danger" @click="emit('confirm')">Confirm</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
