import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "New connector",
};

export default function NewConnectorPage() {
  redirect("/connectors");
}

