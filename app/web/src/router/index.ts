import EditorView from '@/views/editor-view.vue'
import FilesView from '@/views/files-view.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FilesView,
    },
    {
      path: '/file/:fileId/:shapeId?',
      name: 'editor',
      component: EditorView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
