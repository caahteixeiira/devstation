import { AppError } from "../../errors/AppError.js";
import {
  createExperiment,
  deleteExperiment,
  findAllExperiments,
  findExperimentById,
  findProjectById,
  findTechnologiesByIds,
  updateExperiment,
} from "./experiment.repository.js";
import type {
  CreateExperimentBody,
  UpdateExperimentBody,
} from "./experiment.schema.js";

function validateExperimentResult(
  status: CreateExperimentBody["status"],
  result: string | null | undefined,
) {
  if (status === "COMPLETED" && !result?.trim()) {
    throw new AppError("A completed experiment must have a result.", 400);
  }
}

async function validateProject(projectId: number | null | undefined) {
  if (projectId == null) {
    return;
  }

  const project = await findProjectById(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }
}

async function validateTechnologies(ids: number[]) {
  if (ids.length === 0) {
    return;
  }

  const technologies = await findTechnologiesByIds(ids);

  if (technologies.length !== ids.length) {
    throw new AppError("One or more technologies were not found.", 404);
  }
}

export async function listExperiments() {
  return findAllExperiments();
}

export async function getExperimentById(id: number) {
  const experiment = await findExperimentById(id);

  if (!experiment) {
    throw new AppError("Experiment not found.", 404);
  }

  return experiment;
}

export async function createNewExperiment(data: CreateExperimentBody) {
  validateExperimentResult(data.status, data.result);
  await validateProject(data.projectId);

  const technologyIds = [...new Set(data.technologyIds ?? [])];

  await validateTechnologies(technologyIds);

  return createExperiment({
    ...data,
    projectId: data.projectId ?? null,
    result: data.result ?? null,
    technologyIds,
  });
}

export async function updateExistingExperiment(
  id: number,
  data: UpdateExperimentBody,
) {
  const experiment = await getExperimentById(id);

  const finalStatus = data.status ?? experiment.status;
  const finalResult =
    data.result !== undefined ? data.result : experiment.result;

  validateExperimentResult(finalStatus, finalResult);
  await validateProject(data.projectId);

  const technologyIds =
    data.technologyIds === undefined
      ? undefined
      : [...new Set(data.technologyIds)];

  if (technologyIds !== undefined) {
    await validateTechnologies(technologyIds);
  }

  return updateExperiment(id, {
    ...data,
    ...(technologyIds !== undefined && { technologyIds }),
  });
}

export async function deleteExistingExperiment(id: number) {
  await getExperimentById(id);

  return deleteExperiment(id);
}
