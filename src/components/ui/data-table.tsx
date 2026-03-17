"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ColumnDef<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export type DataTableProps<T> = {
  columns: Array<ColumnDef<T>>;
  rows: T[];
  getRowKey?: (row: T, index: number) => string;
  empty?: React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  empty,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-zinc-200", className)}>
      <div className="overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 bg-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "border-b border-zinc-200 px-3 py-2 text-left font-medium text-zinc-700",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8" colSpan={columns.length}>
                  {empty ?? (
                    <div className="text-center text-sm text-zinc-600">
                      No rows
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const key = getRowKey?.(row, index) ?? String(index);
                return (
                  <tr key={key} className="hover:bg-zinc-50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "border-b border-zinc-100 px-3 py-2 align-top text-zinc-900",
                          col.className,
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

