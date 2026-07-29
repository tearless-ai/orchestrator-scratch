import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { sum } from "./sum.js";

faultCheck("unit");

describe("sum", () => {
  it("sums an empty list to zero", () => {
    expect(sum([])).toBe(0);
  });

  it("gives back the only element of a single-element list", () => {
    expect(sum([2])).toBe(2);
  });

  it("adds several elements", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  it("handles negatives and non-integers", () => {
    expect(sum([-1, 0.5, 2])).toBe(1.5);
    expect(sum([-4, -6])).toBe(-10);
  });

  it("leaves the caller's array alone", () => {
    const values = [1, 2, 3];
    sum(values);
    expect(values).toEqual([1, 2, 3]);
  });
});
