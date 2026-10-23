import "server-only";
import {
  apiGet,
  apiPost,
  apiPatch,
  ApiError,
} from "@/lib/api/client";
import {
  technologiesResponseSchema,
  technologyResponseSchema,
  type Technology,
  type CreateTechnologyBody,
  type UpdateTechnologyBody,
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


export async function createTechnology(
  data: CreateTechnologyBody,
  token: string,
): Promise<Technology> {
  const response = await apiPost<unknown>(
    "/technologies",
    data,
    { token },
  );

  const parsed = technologyResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid technology creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function updateTechnology(
  id: number,
  data: UpdateTechnologyBody,
  token: string,
): Promise<Technology> {
  const response = await apiPatch<unknown>(
    `/technologies/${id}`,
    data,
    { token },
  );

  const parsed = technologyResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid technology update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}