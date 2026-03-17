import type { Connector, Dataset, Insight } from "@/domain/types";

function nowIso() {
  return new Date().toISOString();
}

let seq = 1;
function id(prefix: string) {
  seq += 1;
  return `${prefix}_${seq}`;
}

const demoDataset: Dataset = {
  id: "ds_demo_revenue",
  name: "Demo: Revenue (monthly)",
  createdAt: nowIso(),
  schema: [
    { name: "month", type: "string" },
    { name: "revenue", type: "number" },
    { name: "region", type: "string" },
  ],
  previewRows: [
    { month: "2025-10", revenue: 120_000, region: "NA" },
    { month: "2025-11", revenue: 142_500, region: "NA" },
    { month: "2025-12", revenue: 135_200, region: "EU" },
    { month: "2026-01", revenue: 155_900, region: "EU" },
    { month: "2026-02", revenue: 162_300, region: "APAC" },
  ],
};

type DbState = {
  datasets: Dataset[];
  connectors: Connector[];
  insights: Insight[];
};

const state: DbState = {
  datasets: [demoDataset],
  connectors: [],
  insights: [],
};

export const db = {
  nowIso,
  id,
  state,
};

