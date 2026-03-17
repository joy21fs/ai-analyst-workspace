import { describe, expect, it } from "vitest";

import { restApi } from "@/api/rest";

describe("restApi (msw)", () => {
  it("creates and lists connectors", async () => {
    const created = await restApi.createConnector({
      name: "My Postgres",
      type: "postgres",
      config: {
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "analytics",
        username: "readonly",
      },
    });

    const list = await restApi.listConnectors();
    expect(list.some((c) => c.id === created.id)).toBe(true);
  });

  it("tests a connector and returns ok status", async () => {
    const created = await restApi.createConnector({
      name: "Ok Connector",
      type: "postgres",
      config: {
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "analytics",
        username: "readonly",
      },
    });

    const result = await restApi.testConnector(created.id);
    expect(result.ok).toBe(true);
    expect(result.status).toBe("ok");
    expect(typeof result.lastTestedAt).toBe("string");
  });

  it("returns an error status for a failing connector (simulated)", async () => {
    const created = await restApi.createConnector({
      name: "Failing Connector",
      type: "postgres",
      config: {
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "analytics",
        username: "readonly",
      },
    });

    const result = await restApi.testConnector(created.id);
    expect(result.ok).toBe(false);
    expect(result.status).toBe("error");
    expect(result.error).toMatch(/simulated/i);
  });
});

