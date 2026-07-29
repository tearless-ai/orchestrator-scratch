/**
 * Split `items` into consecutive groups of `size`, in their original order.
 *
 * Every item appears in exactly one group, so the groups concatenated back
 * together are the original list. The final group is short rather than padded
 * when the list does not divide evenly. A `size` below one is empty rather than
 * an error, matching how `paginate` treats a non-positive `perPage`.
 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size < 1) return [];

  const groups: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    groups.push(items.slice(start, start + size));
  }

  return groups;
}
