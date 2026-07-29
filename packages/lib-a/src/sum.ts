/**
 * Add up every number in `values`.
 *
 * An empty list sums to `0`, the additive identity, so the result is always a
 * number rather than `undefined`. Addition happens in the order given using
 * ordinary IEEE-754 doubles, so the usual floating-point caveats apply: a list
 * of non-integers can land a bit off the exact decimal answer, and a `NaN` or
 * an infinity anywhere in the list propagates to the result.
 */
export function sum(values: readonly number[]): number {
  let total = 0;

  for (const value of values) {
    total += value;
  }

  return total;
}
