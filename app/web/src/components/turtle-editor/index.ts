import { SearchQuery } from '@codemirror/search'
import type CodeMirror from 'vue-codemirror6'
export { default as TurtleEditor } from './editor.vue'
export { default as TurtleFileEditor } from './file.vue'
export {
  injectTurtleEditorContext,
  provideTurtleEditorContext,
  default as TurtleEditorProvider,
} from './provider.vue'

export function scrollToShape(prefixedShape: string, editor: InstanceType<typeof CodeMirror>) {
  const view = editor.view
  if (!view) return

  const query = new SearchQuery({
    search: prefixedShape,
  })

  const cursor = query.getCursor(view.state)
  const line = cursor.next() as IteratorResult<
    { from: number; to: number },
    { from: number; to: number }
  >
  if (!line || !line.value) return

  const block = view.lineBlockAt(line.value.from)
  document.documentElement.scrollTo({
    top: block.top,
    behavior: 'smooth',
  })
}
