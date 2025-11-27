<script setup lang="ts">
import { ComboboxInput } from '@/components/ui/combobox'
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits, type ComboboxInputEmits, type ComboboxInputProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }
>()

const emits = defineEmits<ComboboxInputEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxInput
    v-bind="{ ...forwarded, ...$attrs }"
    data-slot="input-group-control"
    :class="
      cn(
        'flex-1 bg-transparent shadow-none border-0 rounded-none',
        'focus-visible:ring-0',
        props.class,
      )
    "
  />
</template>
