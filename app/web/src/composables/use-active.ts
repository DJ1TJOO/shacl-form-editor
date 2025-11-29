import {
  onClickOutside,
  onKeyStroke,
  unrefElement,
  useActiveElement,
  useMousePressed,
  type MaybeElementRef,
} from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export function useActive(target: MaybeElementRef) {
  const targetElement = computed(() => unrefElement(target))

  const isActive = ref(false)

  const activeElement = useActiveElement()

  function isOptionsElement(element: EventTarget | HTMLElement | null | undefined) {
    return element instanceof HTMLElement && element.closest('[data-slot="options-bar"]')
  }

  function isActivatableElement(element: EventTarget | HTMLElement | null | undefined) {
    return element instanceof HTMLElement && element.closest('[data-activatable]')
  }

  function isInTarget(element: EventTarget | HTMLElement | null | undefined) {
    return element instanceof HTMLElement && targetElement.value?.contains(element)
  }

  function hasDismissableLayer() {
    return !!document.querySelector('[data-dismissable-layer]')
  }

  useMousePressed({
    target: targetElement,
    onPressed: (e) => {
      if (e instanceof MouseEvent && e.button === 0) {
        isActive.value = true
      } else {
        isActive.value = true
      }
    },
  })

  onKeyStroke('Escape', () => {
    if (!isActive.value) return
    if (hasDismissableLayer()) return

    isActive.value = false
  })

  onClickOutside(target, (event) => {
    if (isOptionsElement(event.target) || !isActivatableElement(event.target)) return

    isActive.value = false
  })

  watch(activeElement, (activeElement) => {
    if (isInTarget(activeElement)) {
      isActive.value = true
    } else if (!isOptionsElement(activeElement) && isActivatableElement(activeElement)) {
      isActive.value = false
    }
  })

  function deactivate() {
    isActive.value = false
  }

  return { isActive, deactivate }
}
