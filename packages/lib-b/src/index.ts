import { foo } from "@scratch/shared";

export { last } from "./last.js";
export { paginate } from "./paginate.js";

export function labelB(): string {
  return `lib-b:${foo()}`;
}
