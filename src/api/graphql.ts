import { fetchJson } from "@/api/http";

export type GraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> | undefined>(
  params: {
    query: string;
    variables?: TVariables;
  },
): Promise<TData> {
  const res = await fetchJson<GraphQLResponse<TData>>("/api/graphql", {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (res.errors?.length) {
    const message = res.errors.map((e) => e.message).join("\n");
    throw new Error(message);
  }

  if (!res.data) {
    throw new Error("GraphQL response missing data");
  }

  return res.data;
}

