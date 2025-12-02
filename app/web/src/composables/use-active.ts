import {
  onClickOutside,
  onKeyStroke,
  unrefElement,
  useActiveElement,
  useKeyModifier,
  useMousePressed,
  type MaybeElementRef,
} from '@vueuse/core'
import { computed, onMounted, onUnmounted, readonly, ref, watch } from 'vue'

export interface UseActiveOptions {
  allowGrouping?: boolean
}

export const ACTIVE_ATTRIBUTE = 'data-active'
export const GROUPED_ATTRIBUTE = 'data-grouped'
export const NO_GROUPING_ATTRIBUTE = 'data-no-grouping'
export const ACTIVATABLE_ATTRIBUTE = 'data-activatable'

export const ADDED_TO_GROUP_EVENT = 'added-to-group'
export const REMOVED_FROM_GROUP_EVENT = 'removed-from-group'
export const DEACTIVATE_GROUPED_EVENT = 'deactivate-grouped'

export function useActive(target: MaybeElementRef, options: UseActiveOptions = {}) {
  const { allowGrouping = true } = options
  const targetElement = computed(() => unrefElement(target))

  const isActive = ref(false)
  const isGrouped = ref(false)
  const isNoGrouping = computed(() => isNoGroupingElement(targetElement.value))

  function setActive(value: boolean, grouped?: boolean | null) {
    isActive.value = value
    if (value) {
      targetElement.value?.setAttribute(ACTIVE_ATTRIBUTE, 'true')

      if (grouped && !isGrouped.value) {
        isGrouped.value = true
        targetElement.value?.setAttribute(GROUPED_ATTRIBUTE, 'true')
        window.dispatchEvent(
          new CustomEvent(ADDED_TO_GROUP_EVENT, {
            // @TODO: change to something useful when components are based on data
            detail: {
              id: targetElement.value?.id,
            },
          }),
        )
      }
    } else {
      targetElement.value?.removeAttribute(ACTIVE_ATTRIBUTE)
      targetElement.value?.removeAttribute(GROUPED_ATTRIBUTE)

      if (isGrouped.value) {
        isGrouped.value = false
        window.dispatchEvent(
          new CustomEvent(REMOVED_FROM_GROUP_EVENT, {
            // @TODO: change to something useful when components are based on data
            detail: {
              id: targetElement.value?.id,
            },
          }),
        )
      }
    }
  }

  const activeElement = useActiveElement()
  const ctrlKey = useKeyModifier('Control')

  function isOptionsElement(element: EventTarget | HTMLElement | null | undefined) {
    return !!(element instanceof HTMLElement && element.closest('[data-slot="options-bar"]'))
  }

  function getActivatableElement(element: EventTarget | HTMLElement | null | undefined) {
    return element instanceof HTMLElement ? element.closest(`[${ACTIVATABLE_ATTRIBUTE}]`) : null
  }

  function isActivatableElement(element: EventTarget | HTMLElement | null | undefined) {
    return !!getActivatableElement(element)
  }

  function isNoGroupingElement(element: EventTarget | HTMLElement | null | undefined) {
    return !!(element instanceof HTMLElement && element.closest(`[${NO_GROUPING_ATTRIBUTE}]`))
  }

  function isGroupedElement(element: EventTarget | HTMLElement | null | undefined) {
    return !!(element instanceof HTMLElement && element.closest(`[${GROUPED_ATTRIBUTE}]`))
  }

  function isInTarget(element: EventTarget | HTMLElement | null | undefined) {
    return !!(element instanceof HTMLElement && targetElement.value?.contains(element))
  }

  function hasDismissableLayer() {
    return !!document.querySelector('[data-dismissable-layer]')
  }

  useMousePressed({
    target: targetElement,
    onPressed: (e) => {
      if (e instanceof MouseEvent && e.button !== 0) return

      if (getActivatableElement(e.target) !== targetElement.value) {
        setActive(false)
        return
      }

      if (isActive.value && e.ctrlKey) {
        setActive(false)
        return
      }

      setActive(true, e.ctrlKey && !isNoGrouping.value)
    },
  })

  onKeyStroke('Escape', () => {
    if (!isActive.value) return
    if (hasDismissableLayer()) return

    setActive(false)
  })

  onClickOutside(target, (event) => {
    if (
      !isNoGrouping.value &&
      !isNoGroupingElement(event.target) &&
      isActive.value &&
      event.ctrlKey
    ) {
      setActive(true, true)
      return
    }

    if (
      isOptionsElement(event.target) ||
      !isActivatableElement(event.target) ||
      (!isNoGrouping.value && isGroupedElement(event.target))
    ) {
      return
    }

    setActive(false)
  })

  watch(activeElement, (activeElement) => {
    if (isInTarget(activeElement) && getActivatableElement(activeElement) === targetElement.value) {
      setActive(true, ctrlKey.value && !isNoGrouping.value)
      return
    }

    if (
      isOptionsElement(activeElement) ||
      !isActivatableElement(activeElement) ||
      (!isNoGrouping.value && isGroupedElement(activeElement))
    )
      return

    setActive(false)
  })

  function handleGroupedDeactivate() {
    if (!isGrouped.value) return
    setActive(false)
  }

  watch(targetElement, (targetElement) => {
    if (!targetElement) return

    targetElement.setAttribute(ACTIVATABLE_ATTRIBUTE, '')
    if (!allowGrouping) {
      targetElement.setAttribute(NO_GROUPING_ATTRIBUTE, '')
    }
  })

  onMounted(() => {
    window.addEventListener(DEACTIVATE_GROUPED_EVENT, handleGroupedDeactivate)
  })

  onUnmounted(() => {
    window.removeEventListener(DEACTIVATE_GROUPED_EVENT, handleGroupedDeactivate)
  })

  function deactivate() {
    if (isGrouped.value) {
      window.dispatchEvent(new CustomEvent(DEACTIVATE_GROUPED_EVENT))
    }

    setActive(false)
  }

  return { isActive: readonly(isActive), isGrouped: readonly(isGrouped), deactivate }
}
