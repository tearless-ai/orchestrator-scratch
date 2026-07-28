/**
 * A success or a failure, carried explicitly rather than thrown.
 *
 * Depended on by lib-a, lib-b and api, so any change here recompiles the whole
 * workspace. That is the point: it is what overlap detection is tested against.
 */
export type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Placeholder name, used by every package in the workspace on purpose.
 * See docs/BACKLOG.md.
 */
export function foo(): string {
  return "foo";
}
