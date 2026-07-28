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
| A PR merged through the merge queue | `merge_group` run on a `gh-readonly-queue` ref, then squash merged | pass |

The last two rows are the ones worth building the fixture for: a change passed pre-flight, passed CI on the PR, merged, and then broke `main`. That is the only way to exercise the post-merge watch and auto-revert path without waiting for a real bug to do it by accident.

## Repository settings

| Setting | State |
| --- | --- |
| Required status check `checks` | on |
| Strict up-to-date branches | on |
| Merge queue | on, squash, `ALLGREEN` grouping |
| Squash merge only, delete branch on merge | on |
| Direct push to `main` | blocked, no bypass actors |

The merge queue rule is rejected with `422 Invalid rule 'merge_queue'` on a private repository in a Team org, and accepted immediately once the repository is public.
That is why this repository is public.
It holds no secrets: `DATABASE_URL` is an Actions secret, and crewmates push branches to this repository rather than to forks, so secrets still reach CI.

## The database

`apps/api` runs against a real Neon database, Postgres 18.4.
`apps/api/schema.sql` is applied to it, `DATABASE_URL` is an Actions secret, and `SCRATCH_DB_OPTIONAL` is deliberately not set, so the three Postgres-backed tests actually run.

| Check | Result |
| --- | --- |
| `schema.sql` applied, `widgets` seeded with alpha, beta, gamma | pass |
| `apps/api` tests locally against Neon | pass, 4 of 4 |
| `apps/api` tests in CI against Neon | pass |
| The escape hatch removed | `SCRATCH_DB_OPTIONAL` is unset; an absent `DATABASE_URL` now fails the suite |

Secrets do reach CI here even though the repository is public, because crewmates push branches to this repository rather than to forks. A pull request from a fork would not get `DATABASE_URL`, and its `apps/api` tests would fail loudly rather than skip. That is the correct behaviour.

`apps/api/src/db.ts` rewrites `sslmode=require` to `sslmode=verify-full` before connecting. `pg` currently treats the two identically but warns that a future major will weaken `require` to libpq semantics, which do not verify the certificate.

## Still to verify

- **Branch-per-task.** Architecture §12 wants an ephemeral copy-on-write Neon branch per task, created at spawn and dropped at teardown. That needs a Neon API key, not just a connection string. Today every task would share one database, which is exactly the collision class §12 exists to prevent, so this has to be in place before more than one crewmate runs against `apps/api`.
- The plan's simultaneous-branch ceiling, once the API key exists. This is open question 1 in `architecture.md` §28.
