<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type CodeMirror from 'vue-codemirror6'

interface TurtleEditorContext {
  editor: Ref<InstanceType<typeof CodeMirror> | undefined>
  registerEditor: (editor: InstanceType<typeof CodeMirror>) => void
}

export const [injectTurtleEditorContext, provideTurtleEditorContext] =
  createContext<TurtleEditorContext>('TurtleEditor')
</script>

<script setup lang="ts">
import { ref } from 'vue'

const editor = ref<InstanceType<typeof CodeMirror>>()

const registerEditor = (editorInstance: InstanceType<typeof CodeMirror>) => {
  editor.value = editorInstance
}

provideTurtleEditorContext({ editor, registerEditor })

defineExpose({
  editor,
})
</script>

<template>
  <slot />
</template>
