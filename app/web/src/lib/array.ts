export function arraysEqual<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}
