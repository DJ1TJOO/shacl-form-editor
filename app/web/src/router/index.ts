import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/file/:fileId/:shapeId',
      name: 'editor',
      component: EditorView,
      alias: '/file/:fileId',
    },
  ],
})

export default router
