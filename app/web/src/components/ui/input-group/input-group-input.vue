<script setup lang="ts">
import { Input, type InputEmits, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  InputProps & {
    class?: HTMLAttributes['class']
  }
>()

const emits = defineEmits<InputEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const inputComponentRef = ref<InstanceType<typeof Input> | null>(null)

defineExpose({
  get inputRef() {
    return inputComponentRef.value?.inputRef ?? null
  },
})
</script>

<template>
  <Input
    ref="inputComponentRef"
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
