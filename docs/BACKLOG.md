# Seeded work

Small, verifiable, independent tasks so a test run always has something plausible to do.
They exist to be completed, not to be interesting.

The column that matters is the last one: each task is here because it exercises a specific part of the scheduler or the gate.

| # | Task | Touches | Exercises |
| --- | --- | --- | --- |
| 1 | Add a `clamp(value, min, max)` helper to `lib-a`, with tests | `lib-a` | The happy path baseline. |
| 2 | Fix the off-by-one in `paginate` | `lib-b` | A seeded real bug with a failing test already present. |
| 3 | Add a `warnings: string[]` field to the shared `Result` type | `shared` | Forces recompilation of both leaves and `api`. Overlap detection. |
| 4 | Add a `colour` column to `widgets` and return it from `getWidget` | `api` + `shared` | The database branch, and a cross-package change. |
| 5 | Rename `foo` to something meaningful, everywhere | `shared` + both leaves + `api` | Deliberately wide. Should serialize against everything. |

## Notes for whoever maintains the fixture

**Task 2 is the important one.** `paginate` in `packages/lib-b/src/paginate.ts` treats pages as 0-based while its contract says 1-based, so page 1 returns the second page.
The tests that pin the contract are gated behind `SCRATCH_SEED_PAGINATE_BUG=1` and are red until the bug is fixed.
They are off by default so `main` is not permanently broken; a scenario that wants the bug visible sets the variable.

A task with a pre-existing failing test proves the crewmate reads the gate output rather than declaring success from its own reasoning.

**Task 5's `foo` is intentional.** `foo()` lives in `shared` and is called by `lib-a`, `lib-b` and `api` for no reason other than to make one rename touch every package.
