"use client";

import * as React from "react";

import {
  useConnectors,
  useCreateConnector,
  useTestConnector,
} from "@/api/queries";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ConnectorForm } from "@/features/connectors/connector-form";

export function ConnectorsClient() {
  const connectors = useConnectors();
  const createConnector = useCreateConnector();
  const testConnector = useTestConnector();
  const [open, setOpen] = React.useState(false);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Connectors</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create connectors, test connections, and monitor run status.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">New connector</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New connector</DialogTitle>
              <DialogDescription>
                Create a connector and then run “Test connection” to validate it.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <ConnectorForm
                onSubmit={async (input) => {
                  await createConnector.mutateAsync(input);
                  setOpen(false);
                }}
                isSubmitting={createConnector.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {connectors.isLoading ? (
        <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600">
          Loading…
        </div>
      ) : connectors.isError ? (
        <div className="rounded-xl border border-zinc-200 p-4 text-sm text-red-600">
          Failed to load connectors
        </div>
      ) : connectors.data?.length ? (
        <DataTable
          rows={connectors.data}
          getRowKey={(r) => r.id}
          columns={[
            { key: "name", header: "Name", cell: (r) => r.name },
            { key: "type", header: "Type", cell: (r) => r.type },
            {
              key: "status",
              header: "Status",
              cell: (r) => (
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                  {r.status}
                </span>
              ),
              className: "w-[120px]",
            },
            {
              key: "lastTestedAt",
              header: "Last tested",
              cell: (r) =>
                r.lastTestedAt ? new Date(r.lastTestedAt).toLocaleString() : "—",
            },
            {
              key: "lastError",
              header: "Error",
              cell: (r) => (
                <span className="text-xs text-zinc-600">
                  {r.lastError ?? "—"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "",
              className: "w-[140px]",
              cell: (r) => (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    testConnector.mutate(r.id);
                  }}
                  disabled={testConnector.isPending}
                >
                  Test
                </Button>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState
          title="No connectors yet"
          description="Create one to simulate connection tests and status updates."
          action={
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Create connector
            </Button>
          }
        />
      )}
    </main>
  );
}

