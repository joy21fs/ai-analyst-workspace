import { fetchJson } from "@/api/http";
import type { Connector, Dataset, Insight } from "@/domain/types";

export const restApi = {
  listDatasets: () => fetchJson<Dataset[]>("/api/datasets"),
  getDataset: (id: string) => fetchJson<Dataset>(`/api/datasets/${id}`),
  listConnectors: () => fetchJson<Connector[]>("/api/connectors"),
  createConnector: (
    input: Omit<Connector, "id" | "status" | "lastTestedAt" | "lastError">,
  ) =>
    fetchJson<Connector>("/api/connectors", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  testConnector: (id: string) =>
    fetchJson<{ ok: boolean; status: Connector["status"]; lastTestedAt: string; error?: string }>(
      `/api/connectors/${id}/test`,
      { method: "POST" },
    ),
  listInsights: (datasetId?: string) =>
    fetchJson<Insight[]>(
      datasetId ? `/api/insights?datasetId=${encodeURIComponent(datasetId)}` : "/api/insights",
    ),
  createInsight: (input: Omit<Insight, "id" | "createdAt">) =>
    fetchJson<Insight>("/api/insights", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

