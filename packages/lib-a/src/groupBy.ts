/**
 * Collect `items` into a `Map` of the groups their `key` function picks out.
 *
 * Keys appear in the order they were first seen, and items keep their original
 * relative order inside each group. A group exists only once something maps to
 * it, so no entry is ever an empty array and an empty list gives back an empty
 * `Map`. Keys are compared the way `Map` compares them, so values that are
 * loosely equal but distinct stay in separate groups and `NaN` collects with
 * itself rather than splitting.
 */
export function groupBy<T, K>(
  items: readonly T[],
  key: (item: T) => K,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();

  for (const item of items) {
    const groupKey = key(item);
    const group = groups.get(groupKey);
    if (group === undefined) {
      groups.set(groupKey, [item]);
    } else {
      group.push(item);
    }
  }

  return groups;
}
