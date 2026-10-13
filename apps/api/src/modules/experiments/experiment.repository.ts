import { prisma } from "../../lib/prisma.js";
import type {
  CreateExperimentBody,
  UpdateExperimentBody,
} from "./experiment.schema.js";

const experimentInclude = {
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  technologies: {
    select: {
      id: true,
      name: true,
      category: true,
    },
  },
};

export async function findAllExperiments() {
  return prisma.experiment.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: experimentInclude,
  });
}

export async function findExperimentById(id: number) {
  return prisma.experiment.findUnique({
    where: { id },
    include: experimentInclude,
  });
}

export async function findProjectById(id: number) {
  return prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function findTechnologiesByIds(ids: number[]) {
  return prisma.technology.findMany({
    where: {
      id: { in: ids },
    },
    select: { id: true },
  });
}

export async function createExperiment(data: CreateExperimentBody) {
  const { projectId, technologyIds = [], ...experimentData } = data;

  return prisma.experiment.create({
    data: {
      ...experimentData,
      ...(projectId != null && {
        project: {
          connect: { id: projectId },
        },
      }),
      technologies: {
        connect: technologyIds.map((id) => ({ id })),
      },
    },
    include: experimentInclude,
  });
}

export async function updateExperiment(id: number, data: UpdateExperimentBody) {
  const { projectId, technologyIds, ...experimentData } = data;

  return prisma.experiment.update({
    where: { id },
    data: {
      ...experimentData,

      ...(projectId !== undefined && {
        project:
          projectId === null
            ? { disconnect: true }
            : { connect: { id: projectId } },
      }),

      ...(technologyIds !== undefined && {
        technologies: {
          set: technologyIds.map((id) => ({ id })),
        },
      }),
    },
    include: experimentInclude,
  });
}

export async function deleteExperiment(id: number) {
  return prisma.experiment.delete({
    where: { id },
  });
}
