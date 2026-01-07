import { Namespaces, type NamespaceDefinition } from '@/components/namespace'
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'

export interface File {
  store: string
  name: string
  created: string
  updated: string
  activeNamespaces: NamespaceDefinition['prefix'][]
  implicitBase?: string
  explicitBase?: string
}

export interface FileWithId extends File {
  id: string
}

export function parseFile(file: string): File | null {
  const fileData = JSON.parse(file)
  if (!fileData) return null
  if (typeof fileData.store !== 'string') return null
  if (typeof fileData.name !== 'string') return null
  if (typeof fileData.created !== 'string' || isNaN(Date.parse(fileData.created))) return null
  if (typeof fileData.updated !== 'string' || isNaN(Date.parse(fileData.updated))) return null
  if (!Array.isArray(fileData.activeNamespaces)) return null
  if (typeof fileData.implicitBase !== 'string' && typeof fileData.implicitBase !== 'undefined')
    return null
  if (typeof fileData.explicitBase !== 'string' && typeof fileData.explicitBase !== 'undefined')
    return null

  return {
    store: fileData.store,
    name: fileData.name,
    created: fileData.created,
    updated: fileData.updated,
    activeNamespaces: fileData.activeNamespaces,
    implicitBase: fileData.implicitBase,
    explicitBase: fileData.explicitBase,
  }
}

export function serializeFile(file: File): string {
  return JSON.stringify(file)
}

export function useFiles() {
  const files = ref<FileWithId[]>([])

  function update() {
    files.value = Object.entries(window.localStorage)
      .filter(([key]) => key.startsWith('file-'))
      .map(([key, value]) => {
        const file = parseFile(value)
        if (!file) return null

        return {
          id: key.replace('file-', ''),
          ...file,
        }
      })
      .filter((file) => file !== null)
  }

  function onStorageEvent(event: StorageEvent) {
    if (!event.key?.startsWith('file-')) return
    update()
  }

  useEventListener(window, 'storage', onStorageEvent, { passive: true })

  update()

  return files
}

export function createFile(fileId: string, fileName: string) {
  const file = {
    store: '',
    name: fileName,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    activeNamespaces: Namespaces.DEFAULT_ACTIVE_NAMESPACES,
  } satisfies File

  const stringifiedFile = JSON.stringify(file)
  window.localStorage.setItem(`file-${fileId}`, stringifiedFile)
  dispatchFileUpdateEvent(fileId, null, stringifiedFile)
}

export function renameFile(
  fileId: string,
  newFileId: string,
  fileName: string,
  disableDispatch = false,
) {
  const file = window.localStorage.getItem(`file-${fileId}`)
  if (!file) return false
  const fileData = parseFile(file)
  if (!fileData) return false

  fileData.name = fileName
  fileData.updated = new Date().toISOString()

  const stringifiedFile = JSON.stringify(fileData)
  window.localStorage.setItem(`file-${newFileId}`, stringifiedFile)
  if (!disableDispatch) {
    dispatchFileUpdateEvent(newFileId, null, stringifiedFile)
  }

  window.localStorage.removeItem(`file-${fileId}`)
  if (!disableDispatch) {
    dispatchFileUpdateEvent(fileId, file, null)
  }
  return true
}

export function updateActiveNamespaces(
  fileId: string,
  activeNamespaces: NamespaceDefinition['prefix'][],
) {
  const existingFile = window.localStorage.getItem(`file-${fileId}`)
  if (!existingFile) return false
  const existingFileData = parseFile(existingFile)
  if (!existingFileData) return false

  existingFileData.activeNamespaces = activeNamespaces

  const stringifiedFile = JSON.stringify(existingFileData)
  window.localStorage.setItem(`file-${fileId}`, stringifiedFile)
  dispatchFileUpdateEvent(fileId, existingFile, stringifiedFile)
}

export function updateBase(
  fileId: string,
  {
    implicitBase,
    explicitBase,
  }: {
    implicitBase?: string
    explicitBase?: string
  },
) {
  const existingFile = window.localStorage.getItem(`file-${fileId}`)
  if (!existingFile) return false
  const existingFileData = parseFile(existingFile)
  if (!existingFileData) return false

  existingFileData.implicitBase = implicitBase
  existingFileData.explicitBase = explicitBase

  const stringifiedFile = JSON.stringify(existingFileData)
  window.localStorage.setItem(`file-${fileId}`, stringifiedFile)
  dispatchFileUpdateEvent(fileId, existingFile, stringifiedFile)
}

export function deleteFile(fileId: string) {
  const file = window.localStorage.getItem(`file-${fileId}`)
  if (!file) return false

  window.localStorage.removeItem(`file-${fileId}`)
  dispatchFileUpdateEvent(fileId, file, null)
  return true
}

export function dispatchFileUpdateEvent(
  fileId: string,
  oldValue: string | null,
  newValue: string | null,
) {
  if (!window) return
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: `file-${fileId}`,
      oldValue,
      newValue,
      storageArea: window.localStorage,
    }),
  )
}
