"use client";

import * as React from "react";

import { useConnectors, useDatasets, useInsights } from "@/api/queries";
import { useCreateInsight } from "@/api/queries";
import { fetchJson } from "@/api/http";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartCard } from "@/components/viz/chart-card";
import type { ChatMessage, ToolOutput, VizSpec } from "@/domain/types";
import {
  newAssistantMessage,
  newUserMessage,
  simulateStreamingText,
} from "@/features/chat/streaming";
import { VizRenderer } from "@/features/viz/renderers";

export function WorkspaceClient() {
  const datasets = useDatasets();
  const connectors = useConnectors();
  const insights = useInsights();

  const firstDatasetId = datasets.data?.[0]?.id;

  const createInsight = useCreateInsight();

  const [activeDatasetId, setActiveDatasetId] = React.useState<string | null>(
    null,
  );
  React.useEffect(() => {
    if (!activeDatasetId && firstDatasetId) setActiveDatasetId(firstDatasetId);
  }, [activeDatasetId, firstDatasetId]);

  const activeDataset =
    datasets.data?.find((d) => d.id === activeDatasetId) ?? null;

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content:
        "Ask for a chart (bar/line/pie) or a flowchart. Example: “Show a bar chart of revenue by month.”",
      createdAt: new Date().toISOString(),
      streamState: "complete",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  async function onSend() {
    const text = input.trim();
    if (!text || !activeDatasetId || isSending) return;

    setIsSending(true);
    setInput("");

    const user = newUserMessage(text);
    const assistantLocal = newAssistantMessage();
    setMessages((prev) => [...prev, user, assistantLocal]);

    try {
      const res = await fetchJson<{ datasetId: string; assistant: ChatMessage }>(
        "/api/chat",
        {
          method: "POST",
          body: JSON.stringify({ datasetId: activeDatasetId, message: text }),
        },
      );

      const toolOutputs = res.assistant.toolOutputs ?? [];

      await simulateStreamingText({
        fullText: res.assistant.content,
        onDelta: (delta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantLocal.id
                ? { ...m, content: m.content + delta, streamState: "streaming" }
                : m,
            ),
          );
        },
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantLocal.id
            ? { ...m, streamState: "complete", toolOutputs }
            : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantLocal.id
            ? {
                ...m,
                streamState: "error",
                content: "Something went wrong sending that message.",
              }
            : m,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  async function onSaveViz(spec: VizSpec) {
    if (!activeDatasetId) return;

    await createInsight.mutateAsync({
      datasetId: activeDatasetId,
      title: spec.title ?? `Saved ${spec.kind} chart`,
      description: "Saved from chat tool output.",
      vizSpec: spec,
    });
  }

  function renderToolOutput(output: ToolOutput, idx: number) {
    if (!activeDataset) return null;
    if (output.type === "text") {
      return (
        <div
          key={`tool_${idx}`}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
        >
          {output.text}
        </div>
      );
    }

    return (
      <ChartCard
        key={`tool_${idx}`}
        title={output.vizSpec.title ?? "Visualization"}
        description={output.vizSpec.kind.toUpperCase()}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void onSaveViz(output.vizSpec)}
            disabled={createInsight.isPending}
          >
            Save
          </Button>
        }
      >
        <VizRenderer dataset={activeDataset} spec={output.vizSpec} />
      </ChartCard>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Streaming chat + tool outputs (charts/flow), datasets, and saved
          insights.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="lg:col-span-3">
          <div className="rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-medium">Datasets</p>
            {datasets.isLoading ? (
              <p className="mt-1 text-sm text-zinc-600">Loading…</p>
            ) : datasets.isError ? (
              <p className="mt-1 text-sm text-red-600">Failed to load datasets</p>
            ) : datasets.data?.length ? (
              <div className="mt-3 flex flex-col gap-2">
                {datasets.data.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDatasetId(d.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-zinc-900">
                          {d.name}
                        </div>
                        {activeDatasetId === d.id ? (
                          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                            Active
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-600">{d.id}</div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState
                  title="No datasets"
                  description="Upload a file or use the 1-click demo dataset."
                  action={
                    <Button size="sm" variant="secondary">
                      Upload (soon)
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-medium">Connectors</p>
            {connectors.isLoading ? (
              <p className="mt-1 text-sm text-zinc-600">Loading…</p>
            ) : connectors.data?.length ? (
              <div className="mt-3 flex flex-col gap-2">
                {connectors.data.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-zinc-900">
                        {c.name}
                      </div>
                      <div className="text-xs text-zinc-600">{c.status}</div>
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-600">{c.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-zinc-600">
                None yet. Create one from the Connectors page.
              </p>
            )}
          </div>
        </section>

        <section className="lg:col-span-6">
          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Chat</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Multi-stream assistant + tool outputs rendered as cards.
                </p>
              </div>
              <div className="text-xs text-zinc-600">
                Dataset:{" "}
                <span className="font-medium text-zinc-900">
                  {activeDatasetId ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex max-h-[420px] flex-col gap-3 overflow-auto rounded-xl border border-zinc-200 bg-white p-3">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <MessageBubble role={m.role} content={m.content} />
                  {m.role === "assistant" && m.toolOutputs?.length ? (
                    <div className="grid gap-3">
                      {m.toolOutputs.map((o, i) => renderToolOutput(o, i))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void onSend();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Try: "pie chart of revenue by region" or "flowchart connector run"'
                className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10"
              />
              <Button
                type="submit"
                disabled={!input.trim() || !activeDatasetId || isSending}
              >
                Send
              </Button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-medium">Saved insights</p>
            {insights.isLoading ? (
              <p className="mt-1 text-sm text-zinc-600">Loading…</p>
            ) : insights.data?.length ? (
              <div className="mt-3">
                <DataTable
                  rows={insights.data}
                  getRowKey={(r) => r.id}
                  columns={[
                    { key: "title", header: "Title", cell: (r) => r.title },
                    {
                      key: "kind",
                      header: "Kind",
                      cell: (r) => r.vizSpec.kind,
                      className: "w-[80px]",
                    },
                  ]}
                />
              </div>
            ) : (
              <p className="mt-1 text-sm text-zinc-600">No saved insights yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

