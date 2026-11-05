import "server-only";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiError,
} from "@/lib/api/client";
import {
  experimentsResponseSchema,
  experimentResponseSchema,
  type Experiment,
  type CreateExperimentBody,
  type UpdateExperimentBody,
} from "@/types/experiment";

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

export async function createExperiment(
  data: CreateExperimentBody,
  token: string,
): Promise<Experiment> {
  const response = await apiPost<unknown>(
    "/experiments",
    data,
    { token },
  );

  const parsed = experimentResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experiment creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function getExperimentById(
  id: number,
): Promise<Experiment | null> {
  let response: unknown;

  try {
    response = await apiGet<unknown>(`/experiments/${id}`);
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

  const parsed = experimentResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experiment detail response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function updateExperiment(
  id: number,
  data: UpdateExperimentBody,
  token: string,
): Promise<Experiment> {
  const response = await apiPatch<unknown>(
    `/experiments/${id}`,
    data,
    { token },
  );

  const parsed = experimentResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experiment update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function deleteExperiment(
  id: number,
  token: string,
): Promise<void> {
  await apiDelete(`/experiments/${id}`, { token });
}