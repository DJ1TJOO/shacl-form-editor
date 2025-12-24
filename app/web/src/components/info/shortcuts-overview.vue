<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { reactiveOmit } from '@vueuse/core'
import { ArrowBigUpIcon, CommandIcon, OptionIcon } from 'lucide-vue-next'
import { useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')
const forward = useForwardPropsEmits(delegatedProps, emits)

const open = defineModel<boolean>('open')

interface Shortcut {
  modifier?: 'alt' | 'ctrl' | 'shift'
  key: string
  action: string
}
const shortcuts: Shortcut[] = [
  {
    key: 'Escape',
    action: 'Close dialog, options sidebar',
  },
  {
    modifier: 'alt',
    key: 's',
    action: 'Focus on shape',
  },
  {
    modifier: 'alt',
    key: 'p',
    action: 'Focus on properties',
  },
  {
    modifier: 'alt',
    key: 'c',
    action: 'Focus on constraints',
  },
  {
    modifier: 'alt',
    key: 't',
    action: 'Focus on toolbox',
  },
  {
    modifier: 'alt',
    key: 'o',
    action: 'Focus on options',
  },
]

const getModifierIcon = (modifier?: 'alt' | 'ctrl' | 'shift') => {
  switch (modifier) {
    case 'alt':
      return OptionIcon
    case 'ctrl':
      return CommandIcon
    case 'shift':
      return ArrowBigUpIcon
    default:
      return null
  }
}
</script>

<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogTrigger class="shrink-0" v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Shortcuts editor</DialogTitle>
        <DialogDescription class="flex items-center gap-4 text-sm">
          <span><OptionIcon class="inline size-3" /> = <code>alt</code></span>
          <span><CommandIcon class="inline size-3" /> = <code>ctrl</code></span>
          <span><ArrowBigUpIcon class="inline size-3" /> = <code>shift</code></span>
        </DialogDescription>
      </DialogHeader>

      <table class="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th class="p-2 w-1/5 font-normal text-xs text-left">Shortcut</th>
            <th class="p-2 font-normal text-xs text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(shortcut, index) in shortcuts"
            :key="index"
            class="odd:bg-background-highlighted"
          >
            <td class="p-2">
              <span class="text-sm">
                <component
                  v-if="getModifierIcon(shortcut.modifier)"
                  :is="getModifierIcon(shortcut.modifier)"
                  class="inline size-3"
                />
                <template v-if="shortcut.modifier"> + </template>
                <code>{{ shortcut.key }}</code>
              </span>
            </td>
            <td class="p-2 text-sm">{{ shortcut.action }}</td>
          </tr>
        </tbody>
      </table>
    </DialogScrollContent>
  </Dialog>
</template>
