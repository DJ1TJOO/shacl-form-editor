<script lang="ts">
import { createContext } from 'reka-ui'

interface PropertiesListContext {
  listOpen: Ref<boolean | 'indeterminate' | 'groups'>
  indeterminate: () => void
}

export const [injectPropertiesListContext, providePropertiesListContext] =
  createContext<PropertiesListContext>('PropertiesList')
</script>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { ref, type HTMLAttributes, type Ref } from 'vue'
import CreateGroup from '../grouping/create-group.vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'div',
})

const listOpen = ref<boolean | 'indeterminate' | 'groups'>('indeterminate')

providePropertiesListContext({
  listOpen,
  indeterminate: () => {
    listOpen.value = 'indeterminate'
  },
})
</script>

<template>
  <Primitive v-bind="props" :class="cn('space-y-2 mx-auto max-w-md w-full', props.class)">
    <div class="flex max-md:flex-col gap-2">
      <Button color="background-blue" class="bg-transparent" @click="listOpen = false">
        Collapse all <ChevronUpIcon />
      </Button>
      <Button color="background-blue" class="bg-transparent" @click="listOpen = 'groups'">
        Expand groups <ChevronDownIcon />
      </Button>
      <Button color="background-blue" class="bg-transparent" @click="listOpen = true">
        Expand all <ChevronDownIcon />
      </Button>
    </div>
    <CreateGroup />
    <slot />
  </Primitive>
</template>
