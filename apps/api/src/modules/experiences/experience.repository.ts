import { prisma } from "../../lib/prisma.js";
import type {
  CreateExperienceBody,
  UpdateExperienceBody,
} from "./experience.schema.js";

type CreateExperienceData = Omit<
  CreateExperienceBody,
  "startDate" | "endDate"
> & {
  startDate: Date;
  endDate: Date | null;
};

export async function findTechnologiesByIds(ids: number[]) {
  return prisma.technology.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
    },
  });
}

export async function createExperience(data: CreateExperienceData) {
  const {
    responsibilities = [],
    achievements = [],
    technologyIds = [],
    ...experienceData
  } = data;

  return prisma.experience.create({
    data: {
      ...experienceData,
      responsibilities: {
        create: responsibilities.map((description, order) => ({
          description,
          order,
        })),
      },
      achievements: {
        create: achievements.map((description, order) => ({
          description,
          order,
        })),
      },
      technologies: {
        connect: technologyIds.map((id) => ({ id })),
      },
    },
    include: {
      responsibilities: {
        orderBy: { order: "asc" },
      },
      achievements: {
        orderBy: { order: "asc" },
      },
      technologies: true,
    },
  });
}

export async function findAllExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ current: "desc" }, { startDate: "desc" }, { id: "desc" }],
    include: {
      responsibilities: {
        orderBy: { order: "asc" },
      },
      achievements: {
        orderBy: { order: "asc" },
      },
      technologies: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });
}

export async function findExperienceById(id: number) {
  return prisma.experience.findUnique({
    where: { id },
  });
}

type UpdateExperienceData = Omit<
  UpdateExperienceBody,
  "startDate" | "endDate"
> & {
  startDate?: Date;
  endDate?: Date | null;
};

export async function updateExperience(id: number, data: UpdateExperienceData) {
  const { responsibilities, achievements, technologyIds, ...experienceData } =
    data;

  return prisma.experience.update({
    where: { id },
    data: {
      ...experienceData,

      ...(responsibilities !== undefined && {
        responsibilities: {
          deleteMany: {},
          create: responsibilities.map((description, order) => ({
            description,
            order,
          })),
        },
      }),

      ...(achievements !== undefined && {
        achievements: {
          deleteMany: {},
          create: achievements.map((description, order) => ({
            description,
            order,
          })),
        },
      }),

      ...(technologyIds !== undefined && {
        technologies: {
          set: technologyIds.map((id) => ({ id })),
        },
      }),
    },
    include: {
      responsibilities: {
        orderBy: { order: "asc" },
      },
      achievements: {
        orderBy: { order: "asc" },
      },
      technologies: true,
    },
  });
}

export async function deleteExperience(id: number) {
  return prisma.experience.delete({
    where: { id },
  });
}
