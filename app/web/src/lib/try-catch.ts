export function tryCatch<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  ...args: TArgs
): [error: Error, result: undefined] | [undefined, TResult] {
  try {
    return [undefined, fn(...args)]
  } catch (error) {
    return [error as Error, undefined]
  }
}
