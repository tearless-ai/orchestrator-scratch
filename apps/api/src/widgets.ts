import { err, foo, ok, type Result } from "@scratch/shared";
import { withClient } from "./db.js";

export interface Widget {
  id: number;
  name: string;
}

export async function getWidget(id: number): Promise<Result<Widget>> {
  return withClient(async (client) => {
    const { rows } = await client.query<Widget>(
      "select id, name from widgets where id = $1",
      [id],
    );
    const widget = rows[0];
    return widget ? ok(widget) : err(`no widget ${id}`);
  });
}

export async function listWidgets(): Promise<Widget[]> {
  return withClient(async (client) => {
    const { rows } = await client.query<Widget>("select id, name from widgets order by id");
    return rows;
  });
}

export function labelApi(): string {
  return `api:${foo()}`;
}
