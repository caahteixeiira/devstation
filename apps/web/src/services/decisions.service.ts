import "server-only";

import {
  apiGet,
  apiPost,
  ApiError,
  apiPatch,
  apiDelete,
} from "@/lib/api/client";
import {
  decisionsResponseSchema,
  type Decision,
  type CreateDecisionBody,
  type UpdateDecisionBody,
  decisionResponseSchema,
} from "@/types/decision";

export async function listProjectDecisions(
  projectId: number,
): Promise<Decision[]> {
  const response = await apiGet<unknown>(`/projects/${projectId}/decisions`);

  const parsed = decisionsResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid project decisions response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function createProjectDecision(
  projectId: number,
  data: CreateDecisionBody,
  token: string,
): Promise<Decision> {
  const response = await apiPost<unknown>(
    `/projects/${projectId}/decisions`,
    data,
    { token },
  );

  const parsed = decisionResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid decision creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function updateDecision(
  id: number,
  data: UpdateDecisionBody,
  token: string,
): Promise<Decision> {
  const response = await apiPatch<unknown>(`/decisions/${id}`, data, { token });

  const parsed = decisionResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid decision update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function deleteDecision(id: number, token: string): Promise<void> {
  await apiDelete(`/decisions/${id}`, { token });
}
