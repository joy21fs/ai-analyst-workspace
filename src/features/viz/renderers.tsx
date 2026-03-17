"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReactFlow, { Background, Controls, type Edge, type Node } from "reactflow";

import type { Dataset, VizSpec } from "@/domain/types";

import "reactflow/dist/style.css";

function getNumeric(value: unknown): number | null {
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export function VizRenderer({
  dataset,
  spec,
}: {
  dataset: Dataset;
  spec: VizSpec;
}) {
  if (spec.kind === "flow") {
    const nodes: Node[] = spec.nodes.map((n, idx) => ({
      id: n.id,
      data: { label: n.label },
      position: { x: idx * 180, y: 0 },
      type: "default",
    }));
    const edges: Edge[] = spec.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: false,
    }));

    return (
      <div className="h-[320px] w-full overflow-hidden rounded-xl border border-zinc-200">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    );
  }

  const rows = dataset.previewRows ?? [];

  if (spec.kind === "pie") {
    const map = new Map<string, number>();
    for (const row of rows) {
      const name = getString(row[spec.nameKey]);
      const val = getNumeric(row[spec.valueKey]);
      if (!name || val == null) continue;
      map.set(name, (map.get(name) ?? 0) + val);
    }
    const data = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return (
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // bar/line
  const data = rows
    .map((row) => {
      const x = getString(row[spec.xKey]);
      const y = getNumeric(row[spec.yKey]);
      if (!x || y == null) return null;
      return { x, y };
    })
    .filter(Boolean) as Array<{ x: string; y: number }>;

  const Chart = spec.kind === "line" ? LineChart : BarChart;

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {spec.kind === "line" ? (
            <Line type="monotone" dataKey="y" stroke="#18181b" strokeWidth={2} dot={false} />
          ) : (
            <Bar dataKey="y" fill="#18181b" radius={[6, 6, 0, 0]} />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

