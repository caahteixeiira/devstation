import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import { experimentsResponseSchema, type Experiment } from "@/types/experiment";

export async function listExperiments(): Promise<Experiment[]> {
  const response = await apiGet<unknown>("/experiments");

  const parsed = experimentsResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experiments response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
