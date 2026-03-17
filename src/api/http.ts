export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const resolvedInput =
    typeof input === "string" && input.startsWith("/")
      ? new URL(
          input,
          typeof window !== "undefined" && window.location?.origin
            ? window.location.origin
            : "http://localhost",
        )
      : input;

  const res = await fetch(resolvedInput, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : `Request failed with ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

