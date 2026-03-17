import { http, HttpResponse, type JsonBodyType } from "msw";

import { db } from "@/mocks/db";
import type {
  ChatMessage,
  Connector,
  ConnectorStatus,
  Insight,
  ToolOutput,
  VizSpec,
} from "@/domain/types";

function json(body: JsonBodyType, init?: ResponseInit) {
  return HttpResponse.json(body, init);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function badRequest(message: string, details?: unknown) {
  return json({ message, details }, { status: 400 });
}

function notFound(message = "Not found") {
  return json({ message }, { status: 404 });
}

function simulateTestStatus(connector: Connector): {
  status: ConnectorStatus;
  ok: boolean;
  error?: string;
} {
  const key = `${connector.name}|${connector.type}`;
  const shouldFail = /fail|invalid|bad/i.test(key);
  if (shouldFail) return { status: "error", ok: false, error: "Connection failed (simulated)" };
  return { status: "ok", ok: true };
}

export const handlers = [
  http.get("/api/datasets", () => {
    return json(db.state.datasets);
  }),

  http.get("/api/datasets/:id", ({ params }) => {
    const id = String(params.id);
    const dataset = db.state.datasets.find((d) => d.id === id);
    return dataset ? json(dataset) : notFound("Dataset not found");
  }),

  http.get("/api/connectors", () => {
    return json(db.state.connectors);
  }),

  http.post("/api/connectors", async ({ request }) => {
    const input = (await request.json()) as Partial<Connector>;
    if (!input.name || typeof input.name !== "string") return badRequest("Missing name");
    if (!input.type || typeof input.type !== "string") return badRequest("Missing type");
    if (!input.config) return badRequest("Missing config");

    const created: Connector = {
      id: db.id("conn"),
      name: input.name,
      type: input.type as Connector["type"],
      config: input.config as Connector["config"],
      status: "idle",
    };
    db.state.connectors = [created, ...db.state.connectors];
    return json(created, { status: 201 });
  }),

  http.post("/api/connectors/:id/test", ({ params }) => {
    const id = String(params.id);
    const idx = db.state.connectors.findIndex((c) => c.id === id);
    if (idx === -1) return notFound("Connector not found");

    const connector = db.state.connectors[idx];
    const { ok, status, error } = simulateTestStatus(connector);
    const lastTestedAt = db.nowIso();

    db.state.connectors[idx] = {
      ...connector,
      status,
      lastTestedAt,
      lastError: error,
    };

    return json({ ok, status, lastTestedAt, error });
  }),

  http.get("/api/insights", ({ request }) => {
    const url = new URL(request.url);
    const datasetId = url.searchParams.get("datasetId");
    const insights = datasetId
      ? db.state.insights.filter((i) => i.datasetId === datasetId)
      : db.state.insights;
    return json(insights);
  }),

  http.post("/api/insights", async ({ request }) => {
    const input = (await request.json()) as Partial<Insight>;
    if (!input.datasetId || typeof input.datasetId !== "string")
      return badRequest("Missing datasetId");
    if (!input.title || typeof input.title !== "string") return badRequest("Missing title");
    if (!input.vizSpec) return badRequest("Missing vizSpec");

    const created: Insight = {
      id: db.id("ins"),
      datasetId: input.datasetId,
      title: input.title,
      description: input.description,
      vizSpec: input.vizSpec as Insight["vizSpec"],
      createdAt: db.nowIso(),
    };
    db.state.insights = [created, ...db.state.insights];
    return json(created, { status: 201 });
  }),

  http.post("/api/chat", async ({ request }) => {
    const body = (await request.json()) as {
      datasetId?: string;
      message?: string;
    };

    const datasetId = body.datasetId ?? db.state.datasets[0]?.id;
    const message = String(body.message ?? "").trim();
    if (!message) return badRequest("Missing message");

    const lower = message.toLowerCase();
    const wantsPie = lower.includes("pie");
    const wantsLine = lower.includes("line");
    const wantsFlow = lower.includes("flow");

    const vizSpec: VizSpec = wantsFlow
      ? {
          kind: "flow",
          title: "Connector run (demo flow)",
          nodes: [
            { id: "n1", label: "Start" },
            { id: "n2", label: "Fetch data" },
            { id: "n3", label: "Normalize" },
            { id: "n4", label: "Load" },
          ],
          edges: [
            { id: "e1", source: "n1", target: "n2" },
            { id: "e2", source: "n2", target: "n3" },
            { id: "e3", source: "n3", target: "n4" },
          ],
        }
      : wantsPie
        ? {
            kind: "pie",
            title: "Revenue by region",
            nameKey: "region",
            valueKey: "revenue",
          }
        : {
            kind: wantsLine ? "line" : "bar",
            title: "Revenue by month",
            xKey: "month",
            yKey: "revenue",
          };

    const toolOutputs: ToolOutput[] = [
      { type: "text", text: "Generated a visualization spec (mock)." },
      { type: "viz", vizSpec },
    ];

    const assistant: ChatMessage = {
      id: db.id("msg"),
      role: "assistant",
      content:
        "Here’s a draft visualization based on your request. (This is mocked; later we’ll stream the response.)",
      createdAt: db.nowIso(),
      streamState: "complete",
      toolOutputs,
    };

    return json({ datasetId, assistant });
  }),

  http.post("/api/graphql", async ({ request }) => {
    // Minimal GraphQL stub to show we can support both REST + GraphQL.
    const body = (await request.json()) as { query?: string; variables?: unknown };
    const queryText = String(body.query ?? "").replace(/\s+/g, " ").toLowerCase();
    const variables = body.variables;

    if (queryText.includes("datasets")) {
      return HttpResponse.json({ data: { datasets: db.state.datasets } });
    }

    if (queryText.includes("connectors")) {
      return HttpResponse.json({ data: { connectors: db.state.connectors } });
    }

    if (queryText.includes("insights")) {
      const datasetId =
        isRecord(variables) && typeof variables.datasetId === "string"
          ? variables.datasetId
          : undefined;
      const insights = datasetId
        ? db.state.insights.filter((i) => i.datasetId === datasetId)
        : db.state.insights;
      return HttpResponse.json({ data: { insights } });
    }

    return HttpResponse.json({
      errors: [{ message: "Unknown operation (mock)" }],
    });
  }),
];

