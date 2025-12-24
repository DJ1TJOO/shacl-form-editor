<script lang="ts" setup>
import { Files, useFile } from '@/components/file'
import { Namespaces, Prefixes } from '@/components/namespace'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-vue-next'
import { editor as monacoEditor } from 'monaco-editor'
import { CodeEditor, type EditorOptions } from 'monaco-editor-vue3'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { computed } from 'vue'
import { injectTurtleEditorContext } from './provider.vue'
import { turtleCompletions } from './turtle-completions'
import { turtleLang } from './turtle-lang'

const { file, fileInStorage, deserializationError } = useFile()
const value = computed({
  get() {
    return file.value.store
  },
  set(value) {
    fileInStorage.value = Files.serializeFile({
      ...file.value,
      store: value,
      updated: new Date().toISOString(),
    })
  },
})

const { registerEditor } = injectTurtleEditorContext()

const editorOptions: EditorOptions = {
  fontSize: 12,
  minimap: { enabled: false },
  automaticLayout: true,
}

const namespaces = Namespaces.useActiveNamespacesDefinitions()
const prefixSuggestions = Prefixes.usePrefixSuggestionsList()

const editorDidMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
  registerEditor(editor)
}

const editorWillMount = () => {
  if (!monaco.languages.getLanguages().some((language) => language.id === 'turtle')) {
    monaco.languages.register({
      id: 'turtle',
      extensions: ['.ttl'],
      aliases: ['Turtle'],
    })

    monaco.languages.setMonarchTokensProvider('turtle', turtleLang)

    monaco.languages.registerCompletionItemProvider('turtle', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        return turtleCompletions(model, range, namespaces.value, prefixSuggestions.value)
      },
    })
  }
}
</script>

<template>
  <Tooltip>
    <TooltipTrigger
      :class="
        cn(
          'right-3 bottom-22 z-10 fixed flex justify-center items-center shadow-md p-1 rounded-full text-light',
          deserializationError ? 'bg-danger' : 'bg-success',
        )
      "
    >
      <component :is="deserializationError ? CircleAlertIcon : CircleCheckIcon" class="size-6" />
    </TooltipTrigger>
    <TooltipContent class="max-w-xs">
      {{ deserializationError ?? 'Valid file' }}
    </TooltipContent>
  </Tooltip>
  <CodeEditor
    ref="editorRef"
    class="flex-1 rounded-md overflow-hidden"
    style="height: unset"
    v-model:value="value"
    language="turtle"
    theme="vs-light"
    :options="editorOptions"
    @editorDidMount="editorDidMount"
    @editorWillMount="editorWillMount"
  />
</template>
