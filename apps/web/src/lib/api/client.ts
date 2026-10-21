import "server-only";
import { getApiBaseUrl } from "@/lib/env";

type ApiErrorKind = "HTTP" | "NETWORK" | "INVALID_RESPONSE";

type ApiRequestOptions = {
  method: "GET" | "POST";
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly kind: ApiErrorKind,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API path must start with a single slash.");
  }

  const url = `${getApiBaseUrl()}${path}`;

  const headers = new Headers({
    Accept: "application/json",
  });

  let body: string | undefined;

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  if (options.token) {
  headers.set("Authorization", `Bearer ${options.token}`);
}
  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ApiError(
      "Could not connect to the API or the request timed out.",
      "NETWORK",
    );
  }

  if (!response.ok) {
    throw new ApiError(
      `API request failed with status ${response.status}.`,
      "HTTP",
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(
      "API returned an unreadable JSON response.",
      "INVALID_RESPONSE",
    );
  }
}

export async function apiGet<T>(
  path: string,
  options: { token?: string } = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: "GET",
    token: options.token,
  });
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body,
  });
}