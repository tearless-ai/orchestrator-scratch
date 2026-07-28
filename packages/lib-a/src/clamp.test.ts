import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { clamp } from "./clamp.js";

faultCheck("unit");

describe("clamp", () => {
  it("leaves a value inside the range alone", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("pulls a value up to the minimum", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("pulls a value down to the maximum", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("treats both ends as inclusive", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("refuses an inverted range rather than guessing", () => {
    expect(() => clamp(1, 10, 0)).toThrow(RangeError);
  });
});
