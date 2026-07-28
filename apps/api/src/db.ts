import { Client } from "pg";

/**
 * The connection string is injected into the worktree environment at spawn and
 * points at a per-task Neon branch. It is never in the repo.
 */
export function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See docs/CONVENTIONS.md.");
  }
  return url;
}

/**
 * `pg` currently treats `sslmode=require` as `verify-full`, and warns that a
 * future major will weaken it to libpq semantics, which do not verify the
 * certificate. Say what we mean rather than inherit whichever meaning ships.
 */
export function strictSsl(url: string): string {
  const parsed = new URL(url);
  if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
    return url;
  }
  parsed.searchParams.set("sslmode", "verify-full");
  return parsed.toString();
}

export async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: strictSsl(databaseUrl()) });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}
