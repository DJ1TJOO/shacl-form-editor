<script setup lang="ts">
import { useFile } from '@/components/file'
import { PrefixInput } from '@/components/form-ui/prefix'
import { Property, type PropertyProps } from '@/components/properties'
import { getNamedNode, RDF, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldSet } from '@/components/ui/field'
import { CircleIcon, ForwardIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { subject, order, groupOrder, groupSubject } = defineProps<PropertyProps>()
defineEmits<{
  (e: 'remove'): void
}>()

const { store, currentShape, fileId } = useFile()

const property = ref<string>(subject.value)
watch(property, (newPropertyValue, oldPropertyValue) => {
  if (!currentShape.node.value) return
  if (newPropertyValue === oldPropertyValue) return
  if (!newPropertyValue || !newPropertyValue.includes(':')) return

  const newPropertyNode = getNamedNode(newPropertyValue)

  store.value.removeMatches(currentShape.node.value, Shacl.SHACL('property'), subject)
  store.value.add(currentShape.node.value, Shacl.SHACL('property'), newPropertyNode)
})

const router = useRouter()

const canGoToProperty = computed(() => {
  if (!property.value) {
    return false
  }
  const propertyNode = getNamedNode(property.value)
  return store.value.holds(propertyNode, RDF('type'), Shacl.SHACL('PropertyShape'))
})

function goToProperty() {
  router.push(`/file/${fileId.value}/${encodeURIComponent(subject.value)}`)
}
</script>

<template>
  <Property
    :icon="CircleIcon"
    label="Subproperty"
    :subject="subject"
    :order="order"
    :groupOrder="groupOrder"
    :groupSubject="groupSubject"
    @remove="$emit('remove')"
  >
    <template #options>
      <FieldSet>
        <Field>
          <Button @click="goToProperty" :disabled="!canGoToProperty">
            <ForwardIcon />
            Go to property
          </Button>
        </Field>
      </FieldSet>
    </template>

    <FieldSet>
      <Field>
        <FieldLabel>Property</FieldLabel>
        <PrefixInput
          v-model="property"
          placeholder="ex:MyProperty"
          :types="[Shacl.SHACL('PropertyShape').value]"
        />
      </Field>
    </FieldSet>
  </Property>
</template>
