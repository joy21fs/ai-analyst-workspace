import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-600">
            Portfolio project · Next.js + TypeScript
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            AI Data Analyst Workspace
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700">
            Upload a dataset, chat with a streaming “AI analyst”, and generate
            charts or flowcharts. Includes a realistic connectors UI, caching,
            mocked REST/GraphQL APIs, Storybook, and tests.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-900">1-click demo</p>
            <p className="mt-1 text-sm text-zinc-600">
              Jump into a preloaded dataset and start chatting.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-900">Streaming + tools</p>
            <p className="mt-1 text-sm text-zinc-600">
              Assistant stream + tool outputs (charts/flow) rendered in real
              time.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-900">Connector UX</p>
            <p className="mt-1 text-sm text-zinc-600">
              CSV/TSV/PSV and simulated Postgres/MSSQL with status updates.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/workspace"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Open workspace
          </Link>
          <Link
            href="/connectors"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Manage connectors
          </Link>
          <Link
            href="/account"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Account
          </Link>
        </div>
      </main>
    </div>
  );
}
