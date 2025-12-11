<script lang="ts" setup>
// Load component
import CodeMirror from 'vue-codemirror6'

// CodeMirror extensions
// @TODO: add supported for autocompletion: import { shacledTurtle } from 'shacled-turtle', shacled-turtle is not updated to the latest version of codemirror
import { injectTurtleEditorContext } from '@/components/turtle-editor/provider.vue'
import { turtle } from '@shacl-form-editor/turtle-lang'
import { vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import { useTemplateRef, watch } from 'vue'

const value = defineModel<string>('value')

const { registerEditor } = injectTurtleEditorContext()
const editorRef = useTemplateRef<InstanceType<typeof CodeMirror>>('editor')

watch(
  editorRef,
  (editor) => {
    if (editor) {
      registerEditor(editor)
    }
  },
  { immediate: true },
)
</script>

<template>
  <CodeMirror
    v-model="value"
    ref="editor"
    class="rounded-md overflow-hidden text-sm"
    basic
    tab
    :tabSize="2"
    :extensions="[
      vscodeLightInit({
        settings: {
          fontSize: 14,
        },
      }),
      turtle(),
    ]"
  />
</template>
