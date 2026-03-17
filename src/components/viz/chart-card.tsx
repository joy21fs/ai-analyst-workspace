"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ChartCardProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  actions,
  children,
  className,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-200 bg-white",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          {description ? (
            <div className="mt-0.5 text-sm text-zinc-600">{description}</div>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

