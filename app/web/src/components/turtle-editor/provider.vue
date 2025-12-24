<script lang="ts">
import { editor as monacoEditor } from 'monaco-editor'
import { createContext } from 'reka-ui'

interface TurtleEditorContext {
  editor: monacoEditor.IStandaloneCodeEditor | undefined
  registerEditor: (editor: monacoEditor.IStandaloneCodeEditor) => void
  scrollToShape: (prefixedShape: string) => void
}

export const [injectTurtleEditorContext, provideTurtleEditorContext] =
  createContext<TurtleEditorContext>('TurtleEditor')
</script>

<script setup lang="ts">
let editor: monacoEditor.IStandaloneCodeEditor | undefined = undefined

const registerEditor = (editorInstance: monacoEditor.IStandaloneCodeEditor) => {
  editor = editorInstance
}

function scrollToShape(prefixedShape: string) {
  if (!editor) return

  const model = editor.getModel()
  if (!model) return

  const firstMatch = model.findMatches(`^${prefixedShape}`, true, true, true, null, false, 1)[0]
  if (!firstMatch) return

  const lineNumber = firstMatch.range.startLineNumber
  editor.revealLineInCenter(lineNumber, monacoEditor.ScrollType.Smooth)
}

provideTurtleEditorContext({ editor, registerEditor, scrollToShape })

defineExpose({
  editor,
  scrollToShape,
})
</script>

<template>
  <slot />
</template>
