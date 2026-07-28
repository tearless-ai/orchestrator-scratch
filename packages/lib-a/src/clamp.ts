/**
 * Constrain `value` to the inclusive range [`min`, `max`].
 *
 * An inverted range is a programming error rather than something to paper
 * over, so it throws instead of quietly picking one end.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError(`clamp: min ${min} is greater than max ${max}`);
  }
  return Math.min(Math.max(value, min), max);
}
