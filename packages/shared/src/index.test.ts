import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { err, foo, ok } from "./index.js";

faultCheck("unit");

// Only ever set on main, by the CI workflow. A change can therefore pass every
// pre-merge gate and still break main, which is the only way to exercise the
// post-merge watch and auto-revert path.
faultCheck("main");

describe("Result", () => {
  it("carries a value on success", () => {
    const result = ok(41);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(41);
  });

  it("carries an error on failure", () => {
    const result = err("nope");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("nope");
  });
});

describe("foo", () => {
  it("returns its own name", () => {
    expect(foo()).toBe("foo");
  });
});
