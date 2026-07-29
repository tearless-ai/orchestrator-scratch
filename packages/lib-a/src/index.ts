export { clamp } from "./clamp.js";
export { isEmpty } from "./isEmpty.js";
import { foo } from "@scratch/shared";

/** Remove duplicates, preserving first-seen order. */
export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function labelA(): string {
  return `lib-a:${foo()}`;
}
