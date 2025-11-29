<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { cn } from '@/lib/cn'
import { ref, watch } from 'vue'

const {
  target,
  Define: DefineOptions,
  isOpen,
} = useOptionsSidebar(Symbol('property-options'), 'Options for MyProperty')

const value = ref('')
watch(value, (value) => {
  console.log('input value', value)
})
</script>

<template>
  <DefineOptions>
    <p>test</p>
    <Input v-model="value" />
  </DefineOptions>
  <div
    ref="target"
    :class="
      cn(
        'bg-background mx-auto p-2 rounded-lg max-w-md',
        isOpen && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
    data-activatable
  >
    <h1>Property</h1>
    <Input v-model="value" />
  </div>
</template>
