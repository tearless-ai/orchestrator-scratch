# Fault verification

A fixture whose faults do not fire produces green orchestrator runs that prove nothing, which is a worse outcome than a fixture that does not exist.

So every fault is verified by hand before Orchestrator is pointed at this repo, and re-verified whenever the harness changes.

Last run: 2026-07-28.

## Local

| Command | Expected | Result |
| --- | --- | --- |
| `pnpm test` | green | pass |
| `SCRATCH_FAULT_UNIT=fail pnpm test` | red, `injected fault: unit` | pass |
| `SCRATCH_FAULT_UNIT=flaky SCRATCH_ATTEMPT=1 pnpm test` | red | pass |
| `SCRATCH_FAULT_UNIT=flaky SCRATCH_ATTEMPT=2 pnpm test` | green | pass |
| `SCRATCH_FAULT_UNIT=slow SCRATCH_FAULT_SLOW_MS=4000` | green, takes 4s | pass |
| `SCRATCH_FAULT_UNIT=hang pnpm test` | never returns | pass, still running at 15s |
| `SCRATCH_FAULT_LINT=fail pnpm lint:custom` | red | pass |
| `SCRATCH_FAULT_LINT=flaky SCRATCH_ATTEMPT=1\|2` | red, then green | pass |
| `SCRATCH_FAULT_MAIN=fail pnpm test` | red | pass |
| `SCRATCH_SEED_PAGINATE_BUG=1 pnpm test` | red, `paginate` contract tests | pass |
| `pnpm --filter @scratch/api test` with no `DATABASE_URL` and no `SCRATCH_DB_OPTIONAL` | red, loud | pass |

## CI

Faults are set as repository variables, so no commit is involved.

| Scenario | Expected | Result |
| --- | --- | --- |
| Clean push to `main` | green in under 60s | pass, 36s |
| Direct `git push origin main` | rejected by the ruleset | pass, `Required status check "checks" is expected` |
| `SCRATCH_FAULT_UNIT=fail`, PR | red, `injected fault: unit` in the log | pass |
| `SCRATCH_FAULT_UNIT=flaky`, PR | attempt 1 red | pass |
| The same run, `gh run rerun --failed` | attempt 2 green | pass, `github.run_attempt` drives it |
| `SCRATCH_FAULT_MAIN=fail`, PR | green, the fault is not passed on a non-`main` ref | pass |
| The same change merged | `main` red after landing | pass, `injected fault: main` |
| The variable cleared, failed job re-run | `main` green again | pass |

The last two rows are the ones worth building the fixture for: a change passed pre-flight, passed CI on the PR, merged, and then broke `main`. That is the only way to exercise the post-merge watch and auto-revert path without waiting for a real bug to do it by accident.

## Still to verify

- Anything involving the merge queue, which is not enabled on this repository yet.
- Everything in `apps/api` that touches a database, which needs the Neon project.
