import { afterEach, describe, expect, it } from "vitest";
import { faultCheck } from "./index.js";

// Every test file in this repo consults the harness, so one variable can
// redden any package's gate.
faultCheck("unit");

// The harness proving itself. Uses its own SELFTEST name so a run with
// SCRATCH_FAULT_UNIT set does not change what these assertions mean.
const VAR = "SCRATCH_FAULT_SELFTEST";
const before = {
  fault: process.env[VAR],
  attempt: process.env.SCRATCH_ATTEMPT,
};

function restore(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

afterEach(() => {
  restore(VAR, before.fault);
  restore("SCRATCH_ATTEMPT", before.attempt);
});

describe("faultCheck", () => {
  it("is a no-op when the variable is unset", () => {
    delete process.env[VAR];
    expect(() => faultCheck("selftest")).not.toThrow();
  });

  it("is a no-op for an unrecognised mode", () => {
    process.env[VAR] = "nonsense";
    expect(() => faultCheck("selftest")).not.toThrow();
  });

  it("throws in fail mode", () => {
    process.env[VAR] = "fail";
    expect(() => faultCheck("selftest")).toThrow("injected fault: selftest");
  });

  it("throws on attempt 1 and passes on attempt 2 in flaky mode", () => {
    process.env[VAR] = "flaky";

    process.env.SCRATCH_ATTEMPT = "1";
    expect(() => faultCheck("selftest")).toThrow("injected flake: selftest (attempt 1)");

    process.env.SCRATCH_ATTEMPT = "2";
    expect(() => faultCheck("selftest")).not.toThrow();
  });

  it("treats a missing attempt counter as attempt 1", () => {
    process.env[VAR] = "flaky";
    delete process.env.SCRATCH_ATTEMPT;
    expect(() => faultCheck("selftest")).toThrow("injected flake: selftest (attempt 1)");
  });

  it("returns after the configured delay in slow mode", () => {
    process.env[VAR] = "slow";
    process.env.SCRATCH_FAULT_SLOW_MS = "20";
    const started = performance.now();
    faultCheck("selftest");
    expect(performance.now() - started).toBeGreaterThanOrEqual(15);
    delete process.env.SCRATCH_FAULT_SLOW_MS;
  });
});
