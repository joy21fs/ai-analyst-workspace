import type { Metadata } from "next";

import { ConnectorsClient } from "./connectors-client";

export const metadata: Metadata = {
  title: "Connectors",
};

export default function ConnectorsPage() {
  return <ConnectorsClient />;
}

