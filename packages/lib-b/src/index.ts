import { foo } from "@scratch/shared";

export { paginate } from "./paginate.js";

export function labelB(): string {
  return `lib-b:${foo()}`;
}
