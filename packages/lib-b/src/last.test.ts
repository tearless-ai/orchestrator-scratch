import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { last } from "./last.js";

faultCheck("unit");

const items = [1, 2, 3, 4, 5];

describe("last", () => {
  it("returns the final n items in their original order", () => {
    expect(last(items, 2)).toEqual([4, 5]);
  });

  it("returns everything when n matches the length", () => {
    expect(last(items, items.length)).toEqual(items);
  });

  it("returns everything when n is larger than the list", () => {
    expect(last(items, 99)).toEqual(items);
  });

  it("returns nothing when n is zero", () => {
    expect(last(items, 0)).toEqual([]);
  });

  it("returns nothing when n is negative", () => {
    expect(last(items, -3)).toEqual([]);
  });

  it("handles an empty list", () => {
    expect(last([], 3)).toEqual([]);
  });

  it("leaves the input alone", () => {
    const source = [...items];
    last(source, 2);
    expect(source).toEqual(items);
  });
});
