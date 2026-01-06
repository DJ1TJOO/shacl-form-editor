export function focusSection(slot: string | string[]) {
  const sections = Array.isArray(slot) ? slot : [slot]
  const section = document.querySelector(sections.map((slot) => `[data-slot="${slot}"]`).join(', '))
  if (!section) return

  const focusableElement = section.querySelector<HTMLElement>(
    'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
  )

  if (!focusableElement) return
  focusableElement.focus()
}
