import type { ButtonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'

export { default as InputGroupAddon } from './input-group-addon.vue'
export { default as InputGroupButton } from './input-group-button.vue'
export { default as InputGroupComboboxInput } from './input-group-combobox-input.vue'
export { default as InputGroupInput } from './input-group-input.vue'
export { default as InputGroupSelectTriggerIcon } from './input-group-select-trigger-icon.vue'
export { default as InputGroupSelectTrigger } from './input-group-select-trigger.vue'
export { default as InputGroupText } from './input-group-text.vue'
export { default as InputGroupTextarea } from './input-group-textarea.vue'
export { default as InputGroup } from './input-group.vue'

export const inputGroupAddonVariants = cva(
  [
    'flex items-center justify-center h-auto gap-2 py-1.5',
    'text-text-lighter text-sm font-medium',
    'cursor-text select-none',
    "[&>svg:not([class*='size-'])]:size-4",
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]',
    'group-data-[disabled=true]/input-group:opacity-50',
  ],
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5',
        'block-end':
          'order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

export type InputGroupVariants = VariantProps<typeof inputGroupAddonVariants>

export interface InputGroupButtonProps {
  variant?: ButtonVariants['variant']
  color?: ButtonVariants['color']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}
