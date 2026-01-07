import './assets/main.css'

import Clarity from '@microsoft/clarity'
import VueDnDKitPlugin from '@vue-dnd-kit/core'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID
Clarity.init(projectId)
Clarity.consentV2({ ad_Storage: 'denied', analytics_Storage: 'denied' })

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

const app = createApp(App)

app.use(router)
app.use(VueDnDKitPlugin)

app.mount('#app')
