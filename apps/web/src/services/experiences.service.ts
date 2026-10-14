import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import { experiencesResponseSchema, type Experience } from "@/types/experience";

export async function listExperiences(): Promise<Experience[]> {
  const response = await apiGet<unknown>("/experiences");

  const parsed = experiencesResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experiences response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
