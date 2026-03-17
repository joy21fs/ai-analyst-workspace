"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { RolePill, RoleToggle, useRole } from "@/features/account/role";

export function AccountClient() {
  const { role, setRole } = useRole();
  const canManageConnectors = role === "admin" || role === "member";
  const canDelete = role === "admin";
  const [apiKey, setApiKey] = React.useState("sk_demo_************************");

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Lightweight profile + role-based UI patterns (mocked).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-4">
          <p className="text-sm font-medium">Profile</p>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-xs font-medium text-zinc-700">Name</div>
              <div className="mt-0.5 text-sm text-zinc-900">Joy Yu</div>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-700">Email</div>
              <div className="mt-0.5 text-sm text-zinc-900">joy@example.com</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-zinc-700">Current</div>
              <RolePill role={role} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 p-4">
          <p className="text-sm font-medium">Access control</p>
          <div className="mt-3 flex flex-col gap-3">
            <RoleToggle
              role={role}
              onChange={(next) => {
                setRole(next);
              }}
            />

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs font-medium text-zinc-700">
                API key (placeholder)
              </div>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-9 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
                />
                <Button size="sm" variant="secondary">
                  Rotate
                </Button>
              </div>
              <div className="mt-2 text-xs text-zinc-600">
                Demo only. No secrets are stored.
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-zinc-200 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Gated actions (demo)</p>
            <p className="mt-1 text-sm text-zinc-600">
              Shows how the UI changes based on role.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!canManageConnectors}>
              Create connector
            </Button>
            <Button size="sm" variant="danger" disabled={!canDelete}>
              Delete connector
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <DataTable
            rows={[
              { action: "Create connector", admin: "✅", member: "✅", viewer: "—" },
              { action: "Delete connector", admin: "✅", member: "—", viewer: "—" },
              { action: "Save insights", admin: "✅", member: "✅", viewer: "✅" },
            ]}
            getRowKey={(r) => r.action}
            columns={[
              { key: "action", header: "Action", cell: (r) => r.action },
              { key: "admin", header: "Admin", cell: (r) => r.admin, className: "w-[90px]" },
              { key: "member", header: "Member", cell: (r) => r.member, className: "w-[90px]" },
              { key: "viewer", header: "Viewer", cell: (r) => r.viewer, className: "w-[90px]" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

