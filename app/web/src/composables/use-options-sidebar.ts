import { injectOptionsSidebarProviderContext } from '@/components/options-bar'
import { createReusableTemplate } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useActive } from './use-active'

export function useOptionsSidebar(id: symbol, title: string) {
  const target = ref<HTMLElement>()

  const optionsSidebar = injectOptionsSidebarProviderContext()
  const [Define, Reuse] = createReusableTemplate()

  function open() {
    optionsSidebar.open(id, title, Reuse)
  }

  function close() {
    optionsSidebar.close(id)
    deactivate()
  }

  const { isActive, deactivate } = useActive(target)

  watch(isActive, (isActive) => {
    if (isActive) {
      open()
    } else {
      optionsSidebar.close(id)
    }
  })

  watch(
    () => optionsSidebar.isOpen.value,
    (isOpen) => {
      if (isOpen) return
      deactivate()
    },
  )

  return {
    target,
    Define,
    Reuse,
    open,
    close,
    isOpen: isActive,
  }
}
