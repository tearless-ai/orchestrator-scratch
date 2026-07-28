/**
 * Return a single page of `items`.
 *
 * Pages are 1-based: `paginate(items, 1, 10)` is the first ten items.
 * A page past the end of the list is empty rather than an error.
 */
export function paginate<T>(items: readonly T[], page: number, perPage: number): T[] {
  const start = page * perPage;
  return items.slice(start, start + perPage);
}
