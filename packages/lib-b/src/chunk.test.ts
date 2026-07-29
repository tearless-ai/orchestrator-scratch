import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { chunk } from "./chunk.js";

faultCheck("unit");

const items = [1, 2, 3, 4, 5, 6, 7];

describe("chunk", () => {
  it("splits into consecutive groups with a short final group", () => {
    expect(chunk(items, 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7],
    ]);
  });

  it("covers every item exactly once, in order, for any size", () => {
    for (const size of [1, 2, 3, 4, 6, 7, 8, 99]) {
      expect(chunk(items, size).flat()).toEqual([...items]);
    }
  });

  it("returns one group when size is at least the length", () => {
    expect(chunk(items, items.length)).toEqual([items]);
    expect(chunk(items, 99)).toEqual([items]);
  });

  it("returns nothing when size is zero", () => {
    expect(chunk(items, 0)).toEqual([]);
  });

  it("returns nothing when size is negative", () => {
    expect(chunk(items, -1)).toEqual([]);
  });

  it("handles an empty list", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("leaves the input alone", () => {
    const source = [...items];
    chunk(source, 3);
    expect(source).toEqual(items);
  });

  it("returns new arrays rather than views onto the input", () => {
    const source = [...items];
    const groups = chunk(source, 3);
    for (const group of groups) group.fill(99);
    expect(source).toEqual(items);
    expect(groups).toEqual([
      [99, 99, 99],
      [99, 99, 99],
      [99],
    ]);
  });
});
