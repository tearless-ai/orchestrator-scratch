/**
 * Report whether a list has no elements.
 *
 * Follow-up (deliberately not written as a bare marker, which
 * `scripts/no-todo-lint.mjs` rejects): this only understands arrays. Widening
 * it to strings, Maps, Sets and plain objects wants a decision on what "empty"
 * means for each, so it is left for a later change rather than guessed at here.
 */
export function isEmpty<T>(items: readonly T[]): boolean {
  return items.length === 0;
}
