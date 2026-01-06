import { injectOptionsSidebarProviderContext } from '@/components/options-bar'
import { createReusableTemplate } from '@vueuse/core'
import { onUnmounted, ref, toValue, watch, type Ref } from 'vue'
import { useActive, type UseActiveOptions } from './use-active'

export function useOptionsSidebar(
  id: symbol,
  title: string | Ref<string>,
  options: UseActiveOptions = {},
) {
  const target = ref<HTMLElement>()

  const optionsSidebar = injectOptionsSidebarProviderContext()
  const [Define, Reuse] = createReusableTemplate()

  function open() {
    optionsSidebar.open(id, toValue(title), Reuse)
  }

  function close() {
    optionsSidebar.close(id)
    deactivate()
  }

  const { isActive, isGrouped, deactivate } = useActive(target, options)

  watch(isActive, (isActive) => {
    if (!isActive) {
      optionsSidebar.close(id)
      return
    }

    if (isGrouped.value) return
    open()
  })

  watch(optionsSidebar.currentId, (newId, oldId) => {
    if (newId !== undefined || oldId !== id) return
    deactivate()
  })

  onUnmounted(() => {
    close()
  })

  return {
    target,
    Define,
    Reuse,
    open,
    close,
    isOpen: isActive,
  }
}
