/**
 * Return the final `n` items of `items`, in their original order.
 *
 * Asking for more items than there are returns all of them, and a count at or
 * below zero is empty rather than an error, matching how `paginate` treats a
 * page outside the list.
 */
export function last<T>(items: readonly T[], n: number): T[] {
  if (n <= 0) return [];

  return items.slice(Math.max(items.length - n, 0));
}
