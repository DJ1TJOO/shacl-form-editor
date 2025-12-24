<script setup lang="ts">
import { useFile } from '@/components/file'
import { properties } from '@/components/properties'
import { getNamedNode, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-vue-next'
import { BlankNode, NamedNode } from 'rdflib'
import { computed, ref } from 'vue'
import BoxItem from './box-item.vue'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'update:open', payload: boolean): void
}>()

const { currentShape, store } = useFile()

const searchQuery = ref('')
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return properties
  }
  const query = searchQuery.value.toLowerCase().trim()
  return properties.filter((item) => item.label.toLowerCase().includes(query))
})
</script>

<template>
  <div
    data-slot="toolbox"
    :class="cn('gap-2 grid bg-background p-2 rounded-lg', open ? 'w-full' : 'w-fit')"
  >
    <div class="flex gap-1">
      <Button color="background-blue" size="icon" @click="$emit('update:open', !open)">
        <component :is="open ? PanelLeftCloseIcon : PanelLeftOpenIcon" />
      </Button>
      <Input v-if="open" v-model="searchQuery" placeholder="Search" />
    </div>

    <div class="group/toolbox-items gap-1 grid" :data-toolbox-open="open">
      <BoxItem
        v-for="item in filteredItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :create="
          (order?: number | undefined, group?: BlankNode | NamedNode) => {
            if (!store || !currentShape.node.value) return

            if (item.editor && item.viewer) {
              Shacl.createPropertyForShape({
                shape: currentShape.node.value,
                store,
                order,
                group,
                editor: item.editor,
                viewer: item.viewer,
                datatype: item.datatype,
                nodeKind: item.nodeKind,
              })
            } else if (item.label === 'Subproperty') {
              const property = new NamedNode('http://example.com/TemporaryProperty')
              store.add(getNamedNode(currentShape.node.value), Shacl.SHACL('property'), property)
            }
          }
        "
      >
        {{ item.tooltip }}
      </BoxItem>
    </div>
  </div>
</template>
