import { foo } from "@scratch/shared";

export { chunk } from "./chunk.js";
export { paginate } from "./paginate.js";

export function labelB(): string {
  return `lib-b:${foo()}`;
}
