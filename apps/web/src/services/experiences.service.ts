import "server-only";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiError,
} from "@/lib/api/client";
import {
  experiencesResponseSchema,
  experienceResponseSchema,
  type Experience,
  type CreateExperienceBody,
  type UpdateExperienceBody,
} from "@/types/experience";

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

export async function createExperience(
  data: CreateExperienceBody,
  token: string,
): Promise<Experience> {
  const response = await apiPost<unknown>(
    "/experiences",
    data,
    { token },
  );

  const parsed = experienceResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experience creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function updateExperience(
  id: number,
  data: UpdateExperienceBody,
  token: string,
): Promise<Experience> {
  const response = await apiPatch<unknown>(
    `/experiences/${id}`,
    data,
    { token },
  );

  const parsed = experienceResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid experience update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function deleteExperience(
  id: number,
  token: string,
): Promise<void> {
  await apiDelete(`/experiences/${id}`, { token });
}