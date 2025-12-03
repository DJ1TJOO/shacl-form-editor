<script setup lang="ts">
import { Property } from '@/components/properties'
import Base from '@/components/properties/base.vue'
import { Shacl } from '@/components/rdf'
import { useNamedNode } from '@/composables/use-shacl'
import { TypeIcon } from 'lucide-vue-next'
import type { BlankNode } from 'rdflib/lib/tf-types'

const { subject } = defineProps<{
  subject: BlankNode
}>()
defineEmits<{
  (e: 'remove'): void
}>()

const { namedNode: path } = useNamedNode({ subject, predicate: Shacl.SHACL('path') })
</script>

<template>
  <Property
    :icon="TypeIcon"
    label="Text Field"
    :path="Shacl.getLocalName(path) ?? undefined"
    @remove="$emit('remove')"
  >
    <template #options>
      <!-- <Input v-model="value" /> -->
      here goes constraints
    </template>

    <Base :subject="subject" />
  </Property>
</template>
