<script setup lang="ts">
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { Check, Minus } from 'lucide-vue-next'
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-slot="slotProps"
    data-slot="checkbox"
    v-bind="forwarded"
    :class="
      cn(
        'peer relative bg-background-highlighted shadow-xs rounded-[4px] size-5! transition-shadow shrink-0',
        'data-[state=checked]:text-branding',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:ring-danger/20',
        ' focus-visible:border-ring outline-none',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="group/checkbox-indicator absolute inset-0 place-content-center grid text-current transition-none"
    >
      <slot v-bind="slotProps">
        <Check class="group-data-[state=indeterminate]/checkbox-indicator:hidden size-4" />
        <Minus class="hidden group-data-[state=indeterminate]/checkbox-indicator:block size-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
