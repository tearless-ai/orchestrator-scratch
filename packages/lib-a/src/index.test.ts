import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { labelA, unique } from "./index.js";

faultCheck("unit");

describe("unique", () => {
  it("removes duplicates", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it("preserves first-seen order", () => {
    expect(unique(["c", "a", "c", "b"])).toEqual(["c", "a", "b"]);
  });

  it("handles an empty list", () => {
    expect(unique([])).toEqual([]);
  });
});

describe("labelA", () => {
  it("uses the shared placeholder", () => {
    expect(labelA()).toBe("lib-a:foo");
  });
});
