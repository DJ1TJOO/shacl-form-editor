import { Dash, RDF, Shacl, Xsd } from '@/components/rdf'
import {
  CalendarClockIcon,
  CalendarIcon,
  CircleIcon,
  DiamondIcon,
  FileTextIcon,
  Link2Icon,
  ListIndentIncreaseIcon,
  ListTodoIcon,
  TextCursorInputIcon,
  TypeIcon,
  TypeOutlineIcon,
} from 'lucide-vue-next'
import type { NamedNode } from 'rdflib/lib/tf-types'
import type { Component } from 'vue'

export interface PropertiesDefinition {
  icon: Component
  label: string
  tooltip: string

  noPropertyShape?: boolean

  editor?: keyof typeof Dash.editors
  viewer?: keyof typeof Dash.viewers
  datatype?: string | NamedNode
  nodeKind?: string | NamedNode
}

export const properties: PropertiesDefinition[] = [
  {
    icon: TypeIcon,
    label: 'Text field',
    tooltip: 'Add to library',
    editor: 'TextFieldEditor',
    viewer: 'LiteralViewer',
    datatype: Xsd.string,
  },
  {
    icon: FileTextIcon,
    label: 'Text area',
    tooltip: 'Add to library',
    editor: 'TextAreaEditor',
    viewer: 'LiteralViewer',
    datatype: Xsd.string,
  },
  {
    icon: TextCursorInputIcon,
    label: 'Combobox',
    tooltip: 'Add to library',
    editor: 'AutoCompleteEditor',
    viewer: 'LabelViewer',
  },
  {
    icon: ListTodoIcon,
    label: 'True / False',
    tooltip: 'Add to library',
    editor: 'BooleanSelectEditor',
    viewer: 'LiteralViewer',
    datatype: Xsd.boolean,
  },
  {
    icon: CalendarIcon,
    label: 'Date',
    tooltip: 'Add to library',
    editor: 'DatePickerEditor',
    viewer: 'LiteralViewer',
    datatype: Xsd.date,
  },
  {
    icon: CalendarClockIcon,
    label: 'DateTime',
    tooltip: 'Add to library',
    editor: 'DateTimePickerEditor',
    viewer: 'LiteralViewer',
    datatype: Xsd.dateTime,
  },
  {
    icon: ListIndentIncreaseIcon,
    label: 'Select',
    tooltip: 'Add to library',
    editor: 'EnumSelectEditor',
    viewer: 'LiteralViewer',
  },
  {
    icon: TypeOutlineIcon,
    label: 'Rich text',
    tooltip: 'Add to library',
    editor: 'RichTextEditor',
    viewer: 'HTMLViewer',
    datatype: RDF('html'),
  },
  {
    icon: Link2Icon,
    label: 'URI',
    tooltip: 'Add to library',
    editor: 'URIEditor',
    viewer: 'LabelViewer',
    nodeKind: Shacl.SHACL('IRI'),
  },
  {
    icon: DiamondIcon,
    label: 'Subnode',
    tooltip: 'Add to library',
    editor: 'DetailsEditor',
    viewer: 'DetailsViewer',
    noPropertyShape: true,
  },
  {
    icon: CircleIcon,
    label: 'Subproperty',
    tooltip: 'Add to library',
    noPropertyShape: true,
  },
] as const
