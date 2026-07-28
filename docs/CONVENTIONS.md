# Conventions

Deliberately short.
If this file grows past a page, the fixture has started competing with the thing it is meant to test.

## Commits

Conventional commits: `type(scope): subject`.
Types in use: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`.
Scope is the package name without the `@scratch/` prefix, for example `fix(lib-b): correct paginate off-by-one`.

Commits are authored by the human who dispatched the work.
No agent co-authors.

## Branches

`fm/<task-id>`, created by the daemon off its own clone.
Nobody pushes to `main`; it is blocked at the repository level so a bug in Orchestrator cannot bypass the gate it is supposed to use.

Squash merge only, branch deleted on merge, through the merge queue.

## The gate

CI runs `pnpm ci-checks` and nothing else, as the required `checks` status.

`ci-checks` is `turbo run lint check-types test --continue` followed by `pnpm lint:custom`.
The custom gate is a plain node script rather than a turbo task on purpose: the real target has ten of them, and the gate runner has to handle that class.

Locally, pre-flight is the same set scoped by `turbo run --affected`.

## Tests

A change comes with a test.
`vitest` in every package, source in `src`, tests beside the source as `*.test.ts`.

Test files are excluded from build output but are still type-checked: `tsconfig.build.json` emits, `tsconfig.json` is what `check-types` reads.

Every test file calls `faultCheck("unit")` at module scope.
That is how one environment variable can redden any package, and it is load-bearing for the fixture. Do not remove it.

## Database

`apps/api` talks to Postgres over `DATABASE_URL`, which points at a per-task Neon branch injected into the worktree environment at spawn.
It is never in the repo.

The schema is one file, `apps/api/schema.sql`, applied by hand to the template branch.
There is no migration runner, on purpose.

A database test that silently skips is the exact failure this fixture exists to catch, so an absent `DATABASE_URL` fails loudly unless `SCRATCH_DB_OPTIONAL=1` is set.

## Pinned toolchain

TypeScript is pinned to `^6.0.3` even though 7.x is the latest release.
`typescript-eslint` declares a peer range of `>=4.8.4 <6.1.0`, so TypeScript 7 makes `pnpm lint` unusable.
Bumping TypeScript without checking that peer range will redden the gate for a reason that has nothing to do with the change being made.

## Markers

`scripts/no-todo-lint.mjs` fails on a bare `TODO` or `FIXME` in tracked source.
Leave the work undone and say so in the completion record instead.
