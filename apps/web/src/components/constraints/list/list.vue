<script setup lang="ts">
import {
  CardinalityConstraints,
  PairConstraints,
  RangeConstraints,
  RootClassConstraints,
  ShapeConstraints,
  StringConstraints,
  TypeConstraints,
  ValidationConstraints,
  ValueConstraints,
} from '@/components/constraints'
import { useFile } from '@/components/file'
import { RDF, Shacl, Xsd } from '@/components/rdf'
import { useNamed, useNamedList } from '@/composables/use-shacl'
import { cn } from '@/lib/cn'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import Item from './item.vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'div',
})

const { currentShape } = useFile()

const { value: datatype } = useNamed({
  subject: currentShape.node,
  predicate: Shacl.SHACL('datatype'),
  readonly: true,
})
const { value: nodeKind } = useNamed({
  subject: currentShape.node,
  predicate: Shacl.SHACL('nodeKind'),
  readonly: true,
})
const { items: classes } = useNamedList({
  subject: currentShape.node,
  predicate: Shacl.SHACL('class'),
  readonly: true,
})

const canHaveRangeConstraints = computed(() => {
  return !datatype.value || !Xsd.isString(datatype.value)
})

const canHaveStringConstraints = computed(() => {
  return !datatype.value || (!Xsd.isDecimal(datatype.value) && !Xsd.isInteger(datatype.value))
})

const isRichText = computed(() => {
  return datatype.value === RDF('html').value
})

const hasClass = computed(() => {
  return classes && Array.isArray(classes) && classes.length > 0
})
</script>

<template>
  <Primitive
    v-bind="props"
    data-slot="constraints"
    :class="cn('space-y-2 mx-auto max-w-md w-full', props.class)"
  >
    <Item label="Cardinality constraints">
      <CardinalityConstraints :subject="currentShape.node.value" />
    </Item>

    <Item label="Type constraints">
      <TypeConstraints
        :subject="currentShape.node.value"
        :fixedDatatype="!!datatype"
        :fixedNodeKind="!!nodeKind"
        :noDatatype="!datatype"
        :noClasses="!!nodeKind"
      />
    </Item>

    <Item v-if="canHaveStringConstraints" label="String constraints">
      <StringConstraints :subject="currentShape.node.value" :noLanguages="isRichText" />
    </Item>

    <Item v-if="canHaveRangeConstraints" label="Range constraints">
      <RangeConstraints :subject="currentShape.node.value" />
    </Item>

    <Item label="Value constraints">
      <ValueConstraints :subject="currentShape.node.value" />
    </Item>

    <Item label="Pair constraints">
      <PairConstraints :subject="currentShape.node.value" :noLessThan="!canHaveRangeConstraints" />
    </Item>

    <Item v-if="hasClass" label="Root class constraints">
      <RootClassConstraints :subject="currentShape.node.value" />
    </Item>

    <Item label="Shape constraints">
      <ShapeConstraints :subject="currentShape.node.value" />
    </Item>

    <Item label="Validation constraints">
      <ValidationConstraints :subject="currentShape.node.value" />
    </Item>
  </Primitive>
</template>
