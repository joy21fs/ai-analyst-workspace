export type Id = string;

export type ConnectorType = "csv" | "tsv" | "psv" | "postgres" | "mssql";
export type ConnectorStatus = "idle" | "testing" | "ok" | "error" | "running";

export type DatasetColumn = {
  name: string;
  type: "string" | "number" | "date" | "boolean";
};

export type Dataset = {
  id: Id;
  name: string;
  schema: DatasetColumn[];
  previewRows: Array<Record<string, string | number | boolean | null>>;
  createdAt: string;
};

export type ConnectorConfig =
  | {
      type: "csv" | "tsv" | "psv";
      delimiter?: string;
      fileName?: string;
    }
  | {
      type: "postgres";
      host: string;
      port: number;
      database: string;
      username: string;
    }
  | {
      type: "mssql";
      host: string;
      port: number;
      database: string;
      username: string;
    };

export type Connector = {
  id: Id;
  name: string;
  type: ConnectorType;
  config: ConnectorConfig;
  status: ConnectorStatus;
  lastTestedAt?: string;
  lastError?: string;
};

export type VizKind = "bar" | "line" | "pie" | "flow";

export type VizSpec =
  | {
      kind: "bar" | "line";
      xKey: string;
      yKey: string;
      seriesKey?: string;
      title?: string;
    }
  | {
      kind: "pie";
      nameKey: string;
      valueKey: string;
      title?: string;
    }
  | {
      kind: "flow";
      title?: string;
      nodes: Array<{ id: string; label: string }>;
      edges: Array<{ id: string; source: string; target: string; label?: string }>;
    };

export type Insight = {
  id: Id;
  datasetId: Id;
  title: string;
  description?: string;
  vizSpec: VizSpec;
  createdAt: string;
};

export type ChatRole = "user" | "assistant" | "system";

export type ToolOutput =
  | { type: "viz"; vizSpec: VizSpec }
  | { type: "text"; text: string };

export type ChatMessage = {
  id: Id;
  role: ChatRole;
  content: string;
  createdAt: string;
  streamState?: "streaming" | "complete" | "error";
  toolOutputs?: ToolOutput[];
};

