import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import { projectsResponseSchema, type ProjectSummary } from "@/types/project";

export async function listProjects(): Promise<ProjectSummary[]> {
  const response = await apiGet<unknown>("/projects");

  const parsed = projectsResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid projects response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
