import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

export { default as Input } from './Input.vue'

export interface InputProps extends /* @vue-ignore */ InputHTMLAttributes {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}

export interface InputEmits {
  (e: 'update:modelValue', payload: string | number): void
}
