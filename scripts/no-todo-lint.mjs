#!/usr/bin/env node
/**
 * A deliberately trivial custom lint gate: fails on a bare TODO marker.
 *
 * It stands in for the ten custom lint scripts on the real target, so the gate
 * runner has to handle the "plain node script" class rather than only turbo
 * tasks. It reads no build output on purpose, so it still runs when the
 * workspace does not compile.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const SELF = "scripts/no-todo-lint.mjs";
const MARKER = /\b(TODO|FIXME)\b/;

// Mirrors packages/faults, deliberately duplicated rather than imported: this
// gate must work before anything is built.
function injectedFault() {
  const mode = process.env.SCRATCH_FAULT_LINT;
  if (!mode) return;

  if (mode === "fail") {
    throw new Error("injected fault: lint");
  }
  if (mode === "flaky" && (Number(process.env.SCRATCH_ATTEMPT) || 1) === 1) {
    throw new Error("injected flake: lint (attempt 1)");
  }
  if (mode === "slow") {
    Atomics.wait(
      new Int32Array(new SharedArrayBuffer(4)),
      0,
      0,
      Number(process.env.SCRATCH_FAULT_SLOW_MS) || 60_000,
    );
  }
  if (mode === "hang") {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2 ** 31 - 1);
  }
}

function trackedFiles() {
  const out = execFileSync(
    "git",
    ["ls-files", "--", "*.ts", "*.mjs", "*.js", "*.sql", "*.yml"],
    { cwd: root, encoding: "utf8" },
  );
  return out.split("\n").filter((line) => line && line !== SELF);
}

function main() {
  injectedFault();

  const violations = [];
  for (const file of trackedFiles()) {
    const lines = readFileSync(resolve(root, file), "utf8").split("\n");
    lines.forEach((line, index) => {
      if (MARKER.test(line)) {
        violations.push(`${relative(root, file)}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  if (violations.length > 0) {
    console.error(`no-todo-lint: ${violations.length} marker(s) left in the tree`);
    for (const violation of violations) console.error(`  ${violation}`);
    process.exit(1);
  }

  console.log(`no-todo-lint: clean`);
}

try {
  main();
} catch (error) {
  console.error(`no-todo-lint: ${error.message}`);
  process.exit(1);
}
