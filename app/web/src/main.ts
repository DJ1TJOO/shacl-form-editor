import './assets/main.css'

import VueDnDKitPlugin from '@vue-dnd-kit/core'
import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(VueDnDKitPlugin)

app.mount('#app')
