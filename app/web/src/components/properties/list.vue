<script lang="ts">
import { createContext } from 'reka-ui'

interface PropertiesListContext {
  listOpen: Ref<boolean | 'indeterminate'>
  indeterminate: () => void
}

export const [injectPropertiesListContext, providePropertiesListContext] =
  createContext<PropertiesListContext>('PropertiesListContext')
</script>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { ref, type HTMLAttributes, type Ref } from 'vue'
import CreateGroup from './create-group.vue'
import Empty from './empty.vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'div',
})

const listOpen = ref<boolean | 'indeterminate'>('indeterminate')

providePropertiesListContext({
  listOpen,
  indeterminate: () => {
    listOpen.value = 'indeterminate'
  },
})
</script>

<template>
  <Primitive v-bind="props" :class="cn('space-y-2', props.class)">
    <div class="flex gap-2 mx-auto max-w-md">
      <Button color="background-blue" class="bg-transparent" @click="listOpen = false">
        Collapse all <ChevronUpIcon />
      </Button>
      <Button color="background-blue" class="bg-transparent" @click="listOpen = true">
        Expand all <ChevronDownIcon />
      </Button>
    </div>
    <CreateGroup />
    <slot />
    <Empty />
  </Primitive>
</template>
