import type { BlankNode, NamedNode } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'

export { default as BooleanProperty } from './fields/boolean-field.vue'
export { default as ComboboxProperty } from './fields/combobox-field.vue'
export { default as DateProperty } from './fields/date-field.vue'
export { default as DateTimeProperty } from './fields/datetime-field.vue'
export { default as RichTextProperty } from './fields/rich-text-field.vue'
export { default as SelectProperty } from './fields/select-field.vue'
export { default as SubnodeProperty } from './fields/subnode-field.vue'
export { default as SubpropertyProperty } from './fields/subproperty-field.vue'
export { default as TextFieldProperty } from './fields/text-field.vue'
export { default as TextAreaProperty } from './fields/textarea-field.vue'
export { default as URIProperty } from './fields/uri-field.vue'

export { default as CreateGroup } from './grouping/create-group.vue'
export { default as Group } from './grouping/group.vue'
export { default as Empty } from './list/empty.vue'
export { default as PropertiesList } from './list/list-with-data.vue'
export { default as Property } from './property.vue'

export type PropertyProps = {
  subject: BlankNode | NamedNode
  order: number
  groupOrder?: number | undefined
  groupSubject?: Quad_Subject | undefined
}
