import type { BlankNode, NamedNode } from 'rdflib'
import type { Quad_Subject } from 'rdflib/lib/tf-types'

export { default as BooleanProperty } from './property/boolean-property.vue'
export { default as ComboboxProperty } from './property/combobox-property.vue'
export { default as DateProperty } from './property/date-property.vue'
export { default as DateTimeProperty } from './property/datetime-property.vue'
export { default as RichTextProperty } from './property/rich-text-property.vue'
export { default as SelectProperty } from './property/select-property.vue'
export { default as SubNodeProperty } from './property/sub-node-property.vue'
export { default as SubProperty } from './property/sub-property.vue'
export { default as TextFieldProperty } from './property/text-property.vue'
export { default as TextAreaProperty } from './property/textarea-property.vue'
export { default as URIProperty } from './property/uri-property.vue'

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
