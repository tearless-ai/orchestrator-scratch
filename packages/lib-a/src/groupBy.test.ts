import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { groupBy } from "./groupBy.js";

faultCheck("unit");

const numbers = [1, 2, 3, 4, 5];
const parity = (n: number): string => (n % 2 === 0 ? "even" : "odd");

describe("groupBy", () => {
  it("collects items under the key their function returns", () => {
    const groups = groupBy(numbers, parity);
    expect(groups).toBeInstanceOf(Map);
    expect(groups.size).toBe(2);
    expect(groups.get("odd")).toEqual([1, 3, 5]);
    expect(groups.get("even")).toEqual([2, 4]);
  });

  it("lists keys in first-seen order", () => {
    expect([...groupBy(numbers, parity).keys()]).toEqual(["odd", "even"]);
    expect([...groupBy([2, 1], parity).keys()]).toEqual(["even", "odd"]);
  });

  it("keeps the original relative order within a group", () => {
    const words = ["ant", "bee", "ape", "bat", "auk"];
    expect(groupBy(words, (word) => word[0]).get("a")).toEqual([
      "ant",
      "ape",
      "auk",
    ]);
  });

  it("covers every item exactly once", () => {
    const groups = groupBy(numbers, parity);
    expect([...groups.values()].flat().sort()).toEqual([...numbers].sort());
  });

  it("has an entry only for keys something mapped to", () => {
    const groups = groupBy([2, 4, 6], parity);
    expect([...groups.keys()]).toEqual(["even"]);
    expect(groups.has("odd")).toBe(false);
    for (const group of groups.values()) expect(group.length).toBeGreaterThan(0);
  });

  it("handles an empty list", () => {
    const groups = groupBy([], parity);
    expect(groups.size).toBe(0);
    expect([...groups.entries()]).toEqual([]);
  });

  it("puts every item in one group when the key is constant", () => {
    expect(groupBy(numbers, () => "all").get("all")).toEqual(numbers);
  });

  it("leaves the input alone", () => {
    const source = [...numbers];
    groupBy(source, parity);
    expect(source).toEqual(numbers);
  });

  it("returns new arrays rather than views onto the input", () => {
    const source = [...numbers];
    const groups = groupBy(source, parity);
    for (const group of groups.values()) group.fill(99);
    expect(source).toEqual(numbers);
    expect(groups.get("odd")).toEqual([99, 99, 99]);
    expect(groups.get("even")).toEqual([99, 99]);
  });

  it("keeps loosely equal but distinct keys apart", () => {
    const groups = groupBy([0, 1, 2], (n) => (n === 0 ? 0 : "0"));
    expect(groups.size).toBe(2);
    expect(groups.get(0)).toEqual([0]);
    expect(groups.get("0")).toEqual([1, 2]);

    const nullish = groupBy([0, 1], (n) => (n === 0 ? null : undefined));
    expect(nullish.size).toBe(2);
    expect(nullish.get(null)).toEqual([0]);
    expect(nullish.get(undefined)).toEqual([1]);
  });

  it("collects NaN keys under a single entry", () => {
    const groups = groupBy(numbers, (n) => (n < 4 ? NaN : "rest"));
    expect(groups.size).toBe(2);
    expect(groups.get(NaN)).toEqual([1, 2, 3]);
    expect(groups.get("rest")).toEqual([4, 5]);
  });

  it("groups by object identity rather than contents", () => {
    const left = { id: "left" };
    const right = { id: "left" };
    const groups = groupBy([1, 2, 3], (n) => (n === 3 ? right : left));
    expect(groups.size).toBe(2);
    expect(groups.get(left)).toEqual([1, 2]);
    expect(groups.get(right)).toEqual([3]);
  });
});
