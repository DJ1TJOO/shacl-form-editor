<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useOptionsSidebar } from '@/composables/use-options-sidebar'
import { cn } from '@/lib/cn'
import { ForwardIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const { label } = defineProps<{
  label: string
}>()

const {
  target,
  Define: DefineOptions,
  isOpen: isOpenOptions,
} = useOptionsSidebar(
  Symbol('constraint-options-' + encodeURIComponent(label)),
  computed(() => label),
  {
    allowGrouping: false,
  },
)
</script>

<template>
  <DefineOptions>
    <slot />
  </DefineOptions>
  <li
    ref="target"
    :class="
      cn(
        'flex justify-between bg-background p-2 rounded-lg list-none',
        isOpenOptions && 'outline-solid outline-2 outline-complementary -outline-offset-2',
      )
    "
  >
    <h2 class="flex justify-center justify-self-center items-center gap-1 w-fit">
      {{ label }}
    </h2>
    <Button variant="ghost" size="icon">
      <ForwardIcon />
    </Button>
  </li>
</template>
