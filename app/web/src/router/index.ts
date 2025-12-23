import { Files } from '@/components/file'
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
      beforeEnter: (to, from, next) => {
        const fileId = to.params.fileId
        if (typeof fileId !== 'string') {
          next('/?fileNotFound=1')
          return
        }

        const storageKey = `file-${fileId}`
        const fileInStorage = window.localStorage.getItem(storageKey)
        if (!fileInStorage) {
          next('/?fileNotFound=1')
          return
        }

        const newFile = Files.parseFile(fileInStorage)
        if (!newFile) {
          next('/?fileNotFound=1')
          return
        }

        next()
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
