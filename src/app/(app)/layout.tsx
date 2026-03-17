"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

const navItems = [
  { href: "/workspace", label: "Workspace" },
  { href: "/connectors", label: "Connectors" },
  { href: "/account", label: "Account" },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              AI Analyst Workspace
            </Link>
            <div className="text-xs text-zinc-500">frontend-first demo</div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "inline-flex h-9 items-center rounded-xl px-3 text-sm font-medium",
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="min-h-[60vh] rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

