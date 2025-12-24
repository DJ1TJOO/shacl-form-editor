export function formatDateInput(date: Date) {
  return date.toISOString().split('T')[0]
}

export function formatDateTimeInput(date: Date) {
  return date.toISOString().split('.')[0]
}
