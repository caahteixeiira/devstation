import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import {
  projectsResponseSchema,
  projectDetailResponseSchema,
  type ProjectSummary,
  type ProjectDetail,
} from "@/types/project";

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

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  let response: unknown;

  try {
    response = await apiGet<unknown>(`/projects/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.kind === "HTTP" &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }

  const parsed = projectDetailResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid project detail response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
