import { AppError } from "../../errors/AppError.js";
import {
  createExperience,
  findTechnologiesByIds,
  findAllExperiences,
  findExperienceById,
  updateExperience,
  deleteExperience,
} from "./experience.repository.js";
import type {
  CreateExperienceBody,
  UpdateExperienceBody,
} from "./experience.schema.js";

export async function createNewExperience(data: CreateExperienceBody) {
  const endDate = data.endDate ?? null;
  validateExperiencePeriod(data.current, data.startDate, endDate);

  const technologyIds = [...new Set(data.technologyIds ?? [])];

  if (technologyIds.length > 0) {
    const technologies = await findTechnologiesByIds(technologyIds);

    if (technologies.length !== technologyIds.length) {
      throw new AppError("One or more technologies were not found.", 404);
    }
  }

  return createExperience({
    ...data,
    technologyIds,
    startDate: new Date(`${data.startDate}T00:00:00.000Z`),
    endDate: endDate === null ? null : new Date(`${endDate}T00:00:00.000Z`),
  });
}

export async function listExperiences() {
  return findAllExperiences();
}

function validateExperiencePeriod(
  current: boolean,
  startDate: string,
  endDate: string | null,
) {
  if (current && endDate !== null) {
    throw new AppError("Current experience cannot have an end date.", 400);
  }

  if (!current && endDate === null) {
    throw new AppError("End date is required for a completed experience.", 400);
  }

  if (endDate !== null && endDate < startDate) {
    throw new AppError("End date cannot be earlier than start date.", 400);
  }
}

export async function updateExistingExperience(
  id: number,
  data: UpdateExperienceBody,
) {
  const experience = await findExperienceById(id);

  if (!experience) {
    throw new AppError("Experience not found.", 404);
  }

  const current = data.current ?? experience.current;

  const startDate =
    data.startDate ?? experience.startDate.toISOString().slice(0, 10);

  const endDate =
    data.endDate !== undefined
      ? data.endDate
      : (experience.endDate?.toISOString().slice(0, 10) ?? null);

  validateExperiencePeriod(current, startDate, endDate);

  const technologyIds =
    data.technologyIds === undefined
      ? undefined
      : [...new Set(data.technologyIds)];

  if (technologyIds !== undefined && technologyIds.length > 0) {
    const technologies = await findTechnologiesByIds(technologyIds);

    if (technologies.length !== technologyIds.length) {
      throw new AppError("One or more technologies were not found.", 404);
    }
  }

  return updateExperience(id, {
    ...data,
    current,
    startDate: new Date(`${startDate}T00:00:00.000Z`),
    endDate: endDate === null ? null : new Date(`${endDate}T00:00:00.000Z`),
    ...(technologyIds !== undefined && { technologyIds }),
  });
}

export async function deleteExistingExperience(id: number) {
  const experience = await findExperienceById(id);

  if (!experience) {
    throw new AppError("Experience not found.", 404);
  }

  return deleteExperience(id);
}
