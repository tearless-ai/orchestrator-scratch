# orchestrator-scratch

A test fixture with a git remote.
Its only job is to be worked on, and broken, by [Orchestrator](https://github.com/tearless-ai/Orchestrator).

It is not a demo and it is not a product.
It mirrors the shape of a real target (Turborepo, pnpm workspaces, TypeScript, Postgres-backed tests, a required-check merge gate) and none of its content.

Two rules follow from that:

1. **It must be able to fail on demand.** Every failure path in the architecture needs a way to be triggered deliberately.
2. **It must be boring.** When a run fails you should know the orchestrator broke, not the fixture.

## Layout

| Package | Depends on | Exists to exercise |
| --- | --- | --- |
| `packages/shared` | nothing | Overlap detection. Everything depends on it, so a change here recompiles the workspace. |
| `packages/lib-a` | `shared` | Truly concurrent crewmates, alongside `lib-b`. |
| `packages/lib-b` | `shared` | The same, plus the seeded `paginate` bug. |
| `packages/faults` | nothing | Fault injection. |
| `apps/api` | `shared` | The per-task database branch lifecycle. |

## Faults

Faults are environment variables read at test time, never edits to the repo.
The harness controls the fault, so a scenario needs no commit and a crewmate cannot accidentally "fix" the fault it was supposed to hit.

| Variable | Effect |
| --- | --- |
| `SCRATCH_FAULT_UNIT=fail` | Every package's unit tests throw. |
| `SCRATCH_FAULT_UNIT=flaky` | Throws on attempt 1, passes on attempt 2. `SCRATCH_ATTEMPT` selects the attempt; CI wires it to `github.run_attempt`. |
| `SCRATCH_FAULT_UNIT=slow` | Tests sleep `SCRATCH_FAULT_SLOW_MS` (default 60s). |
| `SCRATCH_FAULT_UNIT=hang` | Tests never return. |
| `SCRATCH_FAULT_LINT=fail` | The custom lint gate exits non-zero. |
| `SCRATCH_FAULT_MAIN=fail` | Trips only on `main`. A change passes every pre-merge gate and then breaks main. |
| `SCRATCH_SEED_PAGINATE_BUG=1` | Runs the tests that pin `paginate`'s contract, which are red until the seeded bug is fixed. |
| `SCRATCH_DB_OPTIONAL=1` | Lets `apps/api` skip its database tests. Provisioning escape hatch only. |

In CI these are repository *variables* of the same name, so a scenario is set up in repo settings rather than in a commit.
`SCRATCH_FAULT_MAIN` is deliberately passed to the job only when the ref is `main`.

## Commands

```
pnpm install
pnpm ci-checks     # what CI runs, and nothing else
pnpm build
pnpm test
pnpm lint
pnpm check-types
pnpm lint:custom   # the custom gate, a plain node script
```
