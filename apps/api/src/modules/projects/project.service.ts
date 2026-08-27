import type { CreateProjectBody } from "./project.schema.js";
import { AppError } from "../../errors/AppError.js";
import {
  createProject,
  findAllProjects,
  findProjectBySlug,
  findTechnologyIds,
  projectExistsBySlug,
} from "./project.repository.js";

export async function listProjects() {
  return findAllProjects();
}

export async function getProjectBySlug(slug: string) {
  return findProjectBySlug(slug);
}

export async function createNewProject(data: CreateProjectBody) {
  const slugAlreadyExists = await projectExistsBySlug(data.slug);

  if (slugAlreadyExists) {
    throw new AppError(
  "A project with this slug already exists.",
  409,
);
  }

  const uniqueTechnologyIds = [...new Set(data.technologyIds)];

  if (uniqueTechnologyIds.length > 0) {
    const existingTechnologyIds =
      await findTechnologyIds(uniqueTechnologyIds);

    if (
      existingTechnologyIds.length !==
      uniqueTechnologyIds.length
    ) {
      throw new AppError(
  "One or more technologies were not found.",
  400,
);
    }
  }

  return createProject({
    ...data,
    technologyIds: uniqueTechnologyIds,
  });
}