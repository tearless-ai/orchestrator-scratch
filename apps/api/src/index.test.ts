import { faultCheck } from "@scratch/faults";
import { describe, expect, it } from "vitest";
import { getWidget, labelApi, listWidgets } from "./index.js";

faultCheck("unit");

const hasDb = Boolean(process.env.DATABASE_URL);

// A database test that silently skips is the exact failure class this fixture
// exists to catch, so an absent DATABASE_URL is loud. SCRATCH_DB_OPTIONAL is a
// deliberate, visible switch, set only while the Neon project is being
// provisioned. Remove it and this file is red until the database is real.
if (!hasDb && process.env.SCRATCH_DB_OPTIONAL !== "1") {
  throw new Error(
    "apps/api tests need DATABASE_URL. Set SCRATCH_DB_OPTIONAL=1 only while the Neon project is being provisioned.",
  );
}

describe.runIf(hasDb)("widgets", () => {
  it("reads a seeded widget", async () => {
    const result = await getWidget(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.name).toBe("alpha");
  });

  it("reports a missing widget as an error rather than throwing", async () => {
    const result = await getWidget(999_999);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("no widget 999999");
  });

  it("lists the seeded widgets in id order", async () => {
    const widgets = await listWidgets();
    expect(widgets.map((w) => w.name)).toEqual(["alpha", "beta", "gamma"]);
  });
});

describe("labelApi", () => {
  it("uses the shared placeholder", () => {
    expect(labelApi()).toBe("api:foo");
  });
});
