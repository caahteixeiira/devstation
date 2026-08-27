import { prisma } from "../../lib/prisma.js";

export async function findAllProjects() {
  return prisma.project.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      status: true,
      githubUrl: true,
      demoUrl: true,

      technologies: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      technologies: {
  select: {
    id: true,
    name: true,
    category: true,
  },
},
      features: {
        orderBy: {
          order: "asc",
        },
      },
      improvements: {
        orderBy: {
          order: "asc",
        },
      },
      images: {
        orderBy: {
          order: "asc",
        },
      },
      decisions: true,
      articles: true,
      experiments: {
        include: {
          technologies: {
  select: {
    id: true,
    name: true,
    category: true,
  },
},
        },
      },
    },
  });
}
import type { CreateProjectBody } from "./project.schema.js";

export async function createProject(data: CreateProjectBody) {
  const { technologyIds, ...projectData } = data;

  return prisma.project.create({
    data: {
      ...projectData,

      technologies: {
        connect: technologyIds.map((id) => ({
          id,
        })),
      },
    },

    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      status: true,
      githubUrl: true,
      demoUrl: true,

      technologies: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },

      createdAt: true,
    },
  });
}

export async function findTechnologyIds(ids: number[]) {
  const technologies = await prisma.technology.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
    },
  });

  return technologies.map((technology) => technology.id);
}

export async function projectExistsBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  return project !== null;
}