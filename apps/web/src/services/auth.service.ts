import "server-only";
import { apiGet, apiPost, ApiError } from "@/lib/api/client";
import {
  loginResponseSchema,
  authMeResponseSchema,
  type LoginBody,
  type AuthUser,
} from "@/types/auth";

export async function login(data: LoginBody) {
  const response = await apiPost<unknown>("/auth/login", data);

  const parsed = loginResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid login response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function getAuthenticatedUser(
  token: string,
): Promise<AuthUser | null> {
  let response: unknown;

  try {
    response = await apiGet<unknown>("/auth/me", { token });
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.kind === "HTTP" &&
      error.status === 401
    ) {
      return null;
    }

    throw error;
  }

  const parsed = authMeResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid authenticated user response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}