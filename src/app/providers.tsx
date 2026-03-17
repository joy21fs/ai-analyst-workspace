"use client";

import * as React from "react";

import { QueryProvider } from "@/api/queries";

export function Providers({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let cancelled = false;
    void (async () => {
      const { worker } = await import("@/mocks/browser");
      if (cancelled) return;
      await worker.start({
        onUnhandledRequest: "bypass",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <QueryProvider>{children}</QueryProvider>;
}

