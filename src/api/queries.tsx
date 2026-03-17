"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Connector, Dataset, Insight } from "@/domain/types";
import { restApi } from "@/api/rest";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(getQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function useDatasets() {
  return useQuery({
    queryKey: ["datasets"],
    queryFn: restApi.listDatasets,
  });
}

export function useConnectors() {
  return useQuery({
    queryKey: ["connectors"],
    queryFn: restApi.listConnectors,
    refetchInterval: 3000,
  });
}

export function useInsights(datasetId?: string) {
  return useQuery({
    queryKey: ["insights", { datasetId: datasetId ?? null }],
    queryFn: () => restApi.listInsights(datasetId),
  });
}

export function useCreateConnector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restApi.createConnector,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["connectors"] });
    },
  });
}

export function useTestConnector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restApi.testConnector,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["connectors"] });
    },
  });
}

export function useCreateInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restApi.createInsight,
    onSuccess: async (created: Insight) => {
      await qc.invalidateQueries({
        queryKey: ["insights", { datasetId: created.datasetId }],
      });
      await qc.invalidateQueries({ queryKey: ["insights", { datasetId: null }] });
    },
  });
}

export type { Connector, Dataset, Insight };

