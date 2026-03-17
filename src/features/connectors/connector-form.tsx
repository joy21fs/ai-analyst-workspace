"use client";

import * as React from "react";
import { z } from "zod";

import type { Connector, ConnectorConfig, ConnectorType } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["csv", "tsv", "psv", "postgres", "mssql"]),
});

const csvSchema = baseSchema.extend({
  type: z.enum(["csv", "tsv", "psv"]),
  fileName: z.string().optional(),
  delimiter: z.string().min(1).max(3).optional(),
});

const dbSchema = baseSchema.extend({
  type: z.enum(["postgres", "mssql"]),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().min(1).max(65535),
  database: z.string().min(1, "Database is required"),
  username: z.string().min(1, "Username is required"),
});

const schema = z.discriminatedUnion("type", [csvSchema, dbSchema]);

type FormState = z.infer<typeof schema>;
type CsvState = Extract<FormState, { type: "csv" | "tsv" | "psv" }>;
type DbState = Extract<FormState, { type: "postgres" | "mssql" }>;

function isCsvState(state: FormState): state is CsvState {
  return state.type === "csv" || state.type === "tsv" || state.type === "psv";
}

function isDbState(state: FormState): state is DbState {
  return state.type === "postgres" || state.type === "mssql";
}

function defaultForm(type: ConnectorType = "postgres"): FormState {
  if (type === "csv" || type === "tsv" || type === "psv") {
    return { name: "", type, fileName: "", delimiter: "" };
  }
  return {
    name: "",
    type,
    host: "localhost",
    port: type === "mssql" ? 1433 : 5432,
    database: "",
    username: "",
  };
}

function toConfig(state: FormState): ConnectorConfig {
  switch (state.type) {
    case "csv":
    case "tsv":
    case "psv":
      return {
        type: state.type,
        delimiter: state.delimiter || undefined,
        fileName: state.fileName || undefined,
      };
    case "postgres":
    case "mssql":
      return {
        type: state.type,
        host: state.host,
        port: state.port,
        database: state.database,
        username: state.username,
      };
  }
}

export type ConnectorFormSubmit = (input: Omit<
  Connector,
  "id" | "status" | "lastTestedAt" | "lastError"
>) => Promise<void>;

export function ConnectorForm({
  initialType = "postgres",
  onSubmit,
  submitLabel = "Create connector",
  isSubmitting,
  className,
}: {
  initialType?: ConnectorType;
  onSubmit: ConnectorFormSubmit;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}) {
  const nameId = React.useId();
  const typeId = React.useId();
  const fileNameId = React.useId();
  const delimiterId = React.useId();
  const hostId = React.useId();
  const portId = React.useId();
  const databaseId = React.useId();
  const usernameId = React.useId();

  const [state, setState] = React.useState<FormState>(() =>
    defaultForm(initialType),
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const csvState = isCsvState(state) ? state : null;
  const dbState = isDbState(state) ? state : null;

  function onChangeType(type: ConnectorType) {
    setState(defaultForm(type));
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(state);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        map[path] = issue.message;
      }
      setErrors(map);
      return;
    }

    await onSubmit({
      name: parsed.data.name,
      type: parsed.data.type,
      config: toConfig(parsed.data),
    });
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-xs font-medium text-zinc-700">
            Name
          </label>
          <input
            id={nameId}
            value={state.name}
            onChange={(e) =>
              setState((prev) => ({ ...prev, name: e.target.value }))
            }
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
            placeholder="Production Postgres"
          />
          {errors.name ? (
            <div className="text-xs text-red-600">{errors.name}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={typeId} className="text-xs font-medium text-zinc-700">
            Type
          </label>
          <select
            id={typeId}
            value={state.type}
            onChange={(e) => onChangeType(e.target.value as ConnectorType)}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
          >
            <option value="csv">CSV</option>
            <option value="tsv">TSV</option>
            <option value="psv">PSV</option>
            <option value="postgres">Postgres</option>
            <option value="mssql">MSSQL</option>
          </select>
        </div>
      </div>

      {csvState ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={fileNameId}
              className="text-xs font-medium text-zinc-700"
            >
              File name
            </label>
            <input
              id={fileNameId}
              value={csvState.fileName ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  isCsvState(prev) ? { ...prev, fileName: e.target.value } : prev,
                )
              }
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              placeholder="revenue.csv"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={delimiterId}
              className="text-xs font-medium text-zinc-700"
            >
              Delimiter
            </label>
            <input
              id={delimiterId}
              value={csvState.delimiter ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  isCsvState(prev)
                    ? { ...prev, delimiter: e.target.value }
                    : prev,
                )
              }
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              placeholder={csvState.type === "psv" ? "|" : csvState.type === "tsv" ? "\\t" : ","}
            />
          </div>
        </div>
      ) : dbState ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={hostId} className="text-xs font-medium text-zinc-700">
              Host
            </label>
            <input
              id={hostId}
              value={dbState.host}
              onChange={(e) =>
                setState((prev) =>
                  isDbState(prev) ? { ...prev, host: e.target.value } : prev,
                )
              }
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              placeholder="db.internal"
            />
            {errors.host ? (
              <div className="text-xs text-red-600">{errors.host}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={portId} className="text-xs font-medium text-zinc-700">
              Port
            </label>
            <input
              id={portId}
              value={String(dbState.port)}
              onChange={(e) => {
                const n = Number(e.target.value);
                setState((prev) =>
                  isDbState(prev)
                    ? { ...prev, port: Number.isFinite(n) ? n : 0 }
                    : prev,
                );
              }}
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              inputMode="numeric"
            />
            {errors.port ? (
              <div className="text-xs text-red-600">{errors.port}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={databaseId}
              className="text-xs font-medium text-zinc-700"
            >
              Database
            </label>
            <input
              id={databaseId}
              value={dbState.database}
              onChange={(e) =>
                setState((prev) =>
                  isDbState(prev) ? { ...prev, database: e.target.value } : prev,
                )
              }
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              placeholder="analytics"
            />
            {errors.database ? (
              <div className="text-xs text-red-600">{errors.database}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={usernameId}
              className="text-xs font-medium text-zinc-700"
            >
              Username
            </label>
            <input
              id={usernameId}
              value={dbState.username}
              onChange={(e) =>
                setState((prev) =>
                  isDbState(prev) ? { ...prev, username: e.target.value } : prev,
                )
              }
              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              placeholder="readonly"
            />
            {errors.username ? (
              <div className="text-xs text-red-600">{errors.username}</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

