import { injectOptionsSidebarProviderContext } from '@/components/options-bar'
import { createReusableTemplate } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useActive } from './use-active'

export function useOptionsSidebar(title: string) {
  const target = ref<HTMLElement>()

  const optionsSidebar = injectOptionsSidebarProviderContext()
  const [Define, Reuse] = createReusableTemplate()

  function open() {
    optionsSidebar.open(title, Reuse)
  }

  function close() {
    optionsSidebar.close()
    deactivate()
  }

  const { isActive, deactivate } = useActive(target)

  watch(isActive, (isActive) => {
    if (isActive) {
      open()
    } else {
      optionsSidebar.close()
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
