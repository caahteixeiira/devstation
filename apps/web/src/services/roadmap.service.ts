import "server-only";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiError,
} from "@/lib/api/client";
import {
  roadmapResponseSchema,
  roadmapItemResponseSchema,
  type RoadmapItem,
  type CreateRoadmapBody,
  type UpdateRoadmapBody,
} from "@/types/roadmap";

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

export async function createRoadmapItem(
  data: CreateRoadmapBody,
  token: string,
): Promise<RoadmapItem> {
  const response = await apiPost<unknown>(
    "/roadmap",
    data,
    { token },
  );

  const parsed = roadmapItemResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid roadmap creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function updateRoadmapItem(
  id: number,
  data: UpdateRoadmapBody,
  token: string,
): Promise<RoadmapItem> {
  const response = await apiPatch<unknown>(
    `/roadmap/${id}`,
    data,
    { token },
  );

  const parsed = roadmapItemResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid roadmap update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function deleteRoadmapItem(
  id: number,
  token: string,
): Promise<void> {
  await apiDelete(`/roadmap/${id}`, { token });
}