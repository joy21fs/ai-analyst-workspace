"use client";

import * as React from "react";

export type Role = "admin" | "member" | "viewer";

const STORAGE_KEY = "ai_analyst_role_v1";

export function useRole() {
  const [role, setRole] = React.useState<Role>("member");

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Role | null;
      if (stored === "admin" || stored === "member" || stored === "viewer") {
        setRole(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const updateRole = React.useCallback((next: Role) => {
    setRole(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return { role, setRole: updateRole };
}

export function RolePill({ role }: { role: Role }) {
  const styles =
    role === "admin"
      ? "border-red-200 bg-red-50 text-red-700"
      : role === "viewer"
        ? "border-zinc-200 bg-zinc-50 text-zinc-700"
        : "border-blue-200 bg-blue-50 text-blue-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles}`}>
      {role}
    </span>
  );
}

export function RoleToggle({
  role,
  onChange,
}: {
  role: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-zinc-700">Role</label>
      <select
        value={role}
        onChange={(e) => onChange(e.target.value as Role)}
        className="h-9 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
      >
        <option value="admin">Admin</option>
        <option value="member">Member</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
}

