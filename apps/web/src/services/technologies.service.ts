import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import {
  technologiesResponseSchema,
  type Technology,
} from "@/types/technology";

export async function listTechnologies(): Promise<Technology[]> {
  const response = await apiGet<unknown>("/technologies");

  const parsed = technologiesResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid technologies response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}