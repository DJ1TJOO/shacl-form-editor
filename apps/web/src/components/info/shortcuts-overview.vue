<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getAlternativeModifier, getDefaultModifier, getSystem } from '@/lib/shortcut'
import { reactiveOmit } from '@vueuse/core'
import {
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CommandIcon,
  OptionIcon,
  RectangleHorizontalIcon,
} from 'lucide-vue-next'
import { useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')
const forward = useForwardPropsEmits(delegatedProps, emits)

const open = defineModel<boolean>('open')

interface Shortcut {
  modifier?: 'default' | 'alternative' | 'arrows' | 'escape'
  key?: string
  info?: string
  action: string
}

interface ShortcutGroup {
  label: string
  shortcuts: Shortcut[]
}

const shortcuts: (Shortcut | ShortcutGroup)[] = [
  {
    modifier: 'default',
    key: 'click on properties',
    action: 'Group properties',
  },
  {
    label: 'Keyboard navigation',
    shortcuts: [
      {
        modifier: 'escape',
        info: 'Escape',
        action: 'Close dialog, options sidebar',
      },
      {
        modifier: 'arrows',
        info: 'Arrows',
        action: 'Move property up/down in the list, when focused on a grip icon',
      },
      {
        modifier: 'alternative',
        key: 's',
        action: 'Focus on shape',
      },
      {
        modifier: 'alternative',
        key: 'p',
        action: 'Focus on properties',
      },
      {
        modifier: 'alternative',
        key: 'c',
        action: 'Focus on constraints',
      },
      {
        modifier: 'alternative',
        key: 't',
        action: 'Focus on toolbox',
      },
      {
        modifier: 'alternative',
        key: 'o',
        action: 'Focus on options',
      },
    ],
  },
]

const getModifierIcon = (modifier?: 'default' | 'alternative' | 'arrows' | 'escape') => {
  if (!modifier) return null

  const os = getSystem()
  switch (modifier) {
    case 'default':
      return CommandIcon
    case 'alternative':
      return os === 'mac' ? ChevronUpIcon : OptionIcon
    case 'arrows':
      return ChevronsUpDownIcon
    case 'escape':
      return RectangleHorizontalIcon
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
          <span>
            <component :is="getModifierIcon('alternative')" class="inline size-3" /> =
            <code>{{ getAlternativeModifier('modifier') === 'Alt' ? 'Alt' : 'Ctrl' }}</code></span
          >
          <span>
            <component :is="getModifierIcon('default')" class="inline size-3" /> =
            <code>{{ getDefaultModifier('modifier') === 'Meta' ? 'Cmd' : 'Ctrl' }}</code>
          </span>
        </DialogDescription>
      </DialogHeader>

      <table class="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th class="p-2 w-1/3 font-normal text-xs text-left">Shortcut</th>
            <th class="p-2 font-normal text-xs text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(shortcut, index) in shortcuts.flatMap((shortcut) =>
              'shortcuts' in shortcut ? [shortcut, ...shortcut.shortcuts] : [shortcut],
            )"
            :key="index"
            class="odd:bg-background-highlighted"
          >
            <template v-if="!('shortcuts' in shortcut)">
              <td class="p-2">
                <span class="text-sm">
                  <component
                    v-if="shortcut.modifier"
                    :is="getModifierIcon(shortcut.modifier)"
                    :class="['inline', shortcut.key ? 'size-3' : 'size-4']"
                  />
                  <template v-if="shortcut.modifier && shortcut.key"> + </template>
                  <code>{{ shortcut.key }}</code>
                  <code v-if="shortcut.info">{{ ' ' }}{{ shortcut.info }}</code>
                </span>
              </td>
              <td class="p-2 text-sm">{{ shortcut.action }}</td>
            </template>
            <template v-else>
              <td colspan="2" class="bg-light p-2 pt-4 text-xs">{{ shortcut.label }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </DialogScrollContent>
  </Dialog>
</template>
