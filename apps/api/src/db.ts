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

export async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const url = databaseUrl();
  const client = new Client({
    connectionString: url,
    ssl: url.includes("localhost") ? false : true,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}
