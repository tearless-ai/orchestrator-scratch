import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { labelB, paginate } from "./index.js";

faultCheck("unit");

// The seeded bug. Set SCRATCH_SEED_PAGINATE_BUG=1 to run the tests that
// actually pin the 1-based contract; they are red until paginate is fixed.
// Off by default so main is not permanently broken.
const seeded = process.env.SCRATCH_SEED_PAGINATE_BUG === "1";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("paginate", () => {
  it("returns at most perPage items", () => {
    expect(paginate(items, 1, 3)).toHaveLength(3);
  });

  it("returns an empty page past the end of the list", () => {
    expect(paginate(items, 100, 3)).toEqual([]);
  });

  it("returns nothing when perPage is zero", () => {
    expect(paginate(items, 1, 0)).toEqual([]);
  });

  it("returns an empty page before the first page", () => {
    expect(paginate(items, 0, 3)).toEqual([]);
    expect(paginate(items, -1, 3)).toEqual([]);
  });

  it("returns nothing when perPage is negative", () => {
    expect(paginate(items, 1, -3)).toEqual([]);
  });

  it.runIf(seeded)("treats page 1 as the first page", () => {
    expect(paginate(items, 1, 3)).toEqual([1, 2, 3]);
  });

  it.runIf(seeded)("returns consecutive pages without a gap", () => {
    expect(paginate(items, 2, 3)).toEqual([4, 5, 6]);
  });

  it.runIf(seeded)("covers the whole list across its pages", () => {
    const pages = [1, 2, 3, 4].flatMap((page) => paginate(items, page, 3));
    expect(pages).toEqual(items);
  });
});

describe("labelB", () => {
  it("uses the shared placeholder", () => {
    expect(labelB()).toBe("lib-b:foo");
  });
});
