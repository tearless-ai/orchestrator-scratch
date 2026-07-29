import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { isEmpty } from "./isEmpty.js";

faultCheck("unit");

describe("isEmpty", () => {
  it("is true for an empty list", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("is false for a list with one element", () => {
    expect(isEmpty([0])).toBe(false);
  });

  it("is false for a list of several elements", () => {
    expect(isEmpty(["a", "b", "c"])).toBe(false);
  });

  it("counts a hole in a sparse list as an element", () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(isEmpty([, ,])).toBe(false);
  });
});
