import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import { roadmapResponseSchema, type RoadmapItem } from "@/types/roadmap";

export async function listRoadmapItems(): Promise<RoadmapItem[]> {
  const response = await apiGet<unknown>("/roadmap");

  const parsed = roadmapResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid roadmap response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
