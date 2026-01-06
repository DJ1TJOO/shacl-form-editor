import { Namespace } from 'rdflib'

export const DASH = Namespace('http://datashapes.org/dash#')

export const editors = {
  AutoCompleteEditor: DASH('AutoCompleteEditor'),
  BlankNodeEditor: DASH('BlankNodeEditor'),
  BooleanSelectEditor: DASH('BooleanSelectEditor'),
  DatePickerEditor: DASH('DatePickerEditor'),
  DateTimePickerEditor: DASH('DateTimePickerEditor'),
  DetailsEditor: DASH('DetailsEditor'),
  EnumSelectEditor: DASH('EnumSelectEditor'),
  InstancesSelectEditor: DASH('InstancesSelectEditor'),
  RichTextEditor: DASH('RichTextEditor'),
  SubClassEditor: DASH('SubClassEditor'),
  TextAreaEditor: DASH('TextAreaEditor'),
  TextAreaWithLangEditor: DASH('TextAreaWithLangEditor'),
  TextFieldEditor: DASH('TextFieldEditor'),
  TextFieldWithLangEditor: DASH('TextFieldWithLangEditor'),
  URIEditor: DASH('URIEditor'),
}

export const viewers = {
  BlankNodeViewer: DASH('BlankNodeViewer'),
  DetailsViewer: DASH('DetailsViewer'),
  HTMLViewer: DASH('HTMLViewer'),
  HyperlinkViewer: DASH('HyperlinkViewer'),
  ImageViewer: DASH('ImageViewer'),
  LabelViewer: DASH('LabelViewer'),
  LangStringViewer: DASH('LangStringViewer'),
  LiteralViewer: DASH('LiteralViewer'),
  URIViewer: DASH('URIViewer'),
  ValueTableViewer: DASH('ValueTableViewer'),
}
