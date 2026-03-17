"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-zinc-500">{icon}</div> : null}
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      {description ? (
        <div className="mt-1 max-w-md text-sm text-zinc-600">{description}</div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

