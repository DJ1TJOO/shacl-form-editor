import { useScroll } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

export function useElementVisibleHeight(elements: string[]) {
  const layoutHeight = ref(0)

  const { y: scrollY } = useScroll(window)

  function getIntersectionHeight(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    const top = Math.max(0, rect.top)
    const bottom = Math.min(window.innerHeight, rect.bottom)
    return top < bottom ? bottom - top : 0
  }

  function updateLayoutHeight() {
    let height = 0
    for (const element of elements) {
      const el = document.querySelector<HTMLElement>(element)
      if (el) height += getIntersectionHeight(el)
    }

    layoutHeight.value = height
  }

  watch(scrollY, updateLayoutHeight)
  onMounted(updateLayoutHeight)

  return layoutHeight
}
