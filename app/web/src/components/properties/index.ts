import type { BlankNode } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'

export { default as CreateGroup } from './create-group.vue'
export { default as Empty } from './empty.vue'
export { default as Group } from './group.vue'
export { default as PropertiesList } from './list-with-data.vue'
export { default as Property } from './property.vue'
export { default as TextFieldProperty } from './text-field.vue'
export { default as TextAreaProperty } from './textarea-field.vue'

export type PropertyProps = {
  subject: BlankNode
  order: number
  groupOrder?: number | undefined
  groupSubject?: Quad_Subject | undefined
}
