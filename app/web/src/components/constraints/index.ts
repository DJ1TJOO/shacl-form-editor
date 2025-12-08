import type { BlankNode, NamedNode } from 'rdflib/lib/tf-types'

export { default as AdditionalConstraints } from './additional.vue'
export { default as CardinalityConstraints } from './cardinality.vue'
export { default as Constraint } from './constraint.vue'
export { default as PairConstraints } from './pair.vue'
export { default as RangeConstraints } from './range.vue'
export { default as ShapeConstraints } from './shape.vue'
export { default as StringConstraints } from './string.vue'
export { default as TargetConstraints } from './targets.vue'
export { default as TypeConstraints } from './type.vue'
export { default as ValidationConstraints } from './validation.vue'
export { default as ValueConstraints } from './value.vue'

export type ConstraintProps = {
  collapsible?: boolean
  subject?: BlankNode | NamedNode
}
