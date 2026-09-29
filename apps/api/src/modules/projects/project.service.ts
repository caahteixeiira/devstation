import type {
  CreateProjectBody,
  UpdateProjectBody,
} from "./project.schema.js";
import { AppError } from "../../errors/AppError.js";
import {
  createProject,
  deleteProjectBySlug,
  findAllProjects,
  findProjectBySlug,
  findTechnologyIds,
  projectExistsBySlug,
  updateProjectBySlug,
} from "./project.repository.js";

export async function deleteExistingProject(slug: string) {
  const projectExists = await projectExistsBySlug(slug);

  if (!projectExists) {
    throw new AppError("Project not found.", 404);
  }

  await deleteProjectBySlug(slug);
}

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

export async function updateExistingProject(
  slug: string,
  data: UpdateProjectBody,
) {
  const projectExists = await projectExistsBySlug(slug);

  if (!projectExists) {
    throw new AppError("Project not found.", 404);
  }

  if (data.slug && data.slug !== slug) {
    const newSlugAlreadyExists =
      await projectExistsBySlug(data.slug);

    if (newSlugAlreadyExists) {
      throw new AppError(
        "A project with this slug already exists.",
        409,
      );
    }
  }

  if (data.technologyIds !== undefined) {
    const uniqueTechnologyIds = [
      ...new Set(data.technologyIds),
    ];

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

    data = {
      ...data,
      technologyIds: uniqueTechnologyIds,
    };
  }

  return updateProjectBySlug(slug, data);
}

