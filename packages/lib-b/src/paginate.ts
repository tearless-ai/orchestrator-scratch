/**
 * Return a single page of `items`.
 *
 * Pages are 1-based: `paginate(items, 1, 10)` is the first ten items.
 * A page past the end of the list is empty rather than an error.
 * So is a page before the first one, or a non-positive `perPage`.
 */
export function paginate<T>(items: readonly T[], page: number, perPage: number): T[] {
  if (page < 1 || perPage < 1) return [];

  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}
