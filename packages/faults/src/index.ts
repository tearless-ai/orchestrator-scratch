/**
 * Fault injection for the Orchestrator scratch fixture.
 *
 * Faults are driven by environment variables read at test time, never by
 * editing the repo. The harness controls the fault, so a test scenario does
 * not require a commit, and a crewmate cannot accidentally "fix" the fault it
 * was supposed to encounter.
 *
 * See docs/scratch-repo.md section 3 in the Orchestrator repo.
 */
export function faultCheck(name: string): void {
  const mode = process.env[`SCRATCH_FAULT_${name.toUpperCase()}`];
  if (!mode) return;

  switch (mode) {
    case "fail":
      throw new Error(`injected fault: ${name}`);
    case "flaky":
      // Deterministic per attempt, not random: the harness increments
      // SCRATCH_ATTEMPT so "fails once then passes" is reproducible.
      if ((Number(process.env.SCRATCH_ATTEMPT) || 1) === 1) {
        throw new Error(`injected flake: ${name} (attempt 1)`);
      }
      return;
    case "slow":
      Atomics.wait(
        new Int32Array(new SharedArrayBuffer(4)),
        0,
        0,
        Number(process.env.SCRATCH_FAULT_SLOW_MS) || 60_000,
      );
      return;
    case "hang":
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2 ** 31 - 1);
      return;
  }
}
