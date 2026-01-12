import './assets/main.css'

import VueDnDKitPlugin from '@vue-dnd-kit/core'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

const app = createApp(App)

app.use(router)
app.use(VueDnDKitPlugin)

app.mount('#app')
