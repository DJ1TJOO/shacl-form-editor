import type { HTMLAttributes, TextareaHTMLAttributes } from 'vue'

export { default as Textarea } from './textarea.vue'

export interface TextareaProps extends /* @vue-ignore */ TextareaHTMLAttributes {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}
