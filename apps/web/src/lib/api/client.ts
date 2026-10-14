import "server-only";
import { getApiBaseUrl } from "@/lib/env";

type ApiErrorKind = "HTTP" | "NETWORK" | "INVALID_RESPONSE";

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

export async function apiGet<T>(path: string): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API path must start with a single slash.");
  }

  const url = `${getApiBaseUrl()}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
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
