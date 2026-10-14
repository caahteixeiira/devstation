import { prisma } from "../../lib/prisma.js";
import type { CreateProjectBody, UpdateProjectBody } from "./project.schema.js";

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
      articles: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
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

export async function createProject(data: CreateProjectBody) {
  const {
    technologyIds,
    features = [],
    improvements = [],
    images = [],
    ...projectData
  } = data;

  return prisma.project.create({
    data: {
      ...projectData,
      technologies: {
        connect: technologyIds.map((id) => ({ id })),
      },
      features: {
        create: features.map((feature, order) => ({
          ...feature,
          order,
        })),
      },
      improvements: {
        create: improvements.map((description, order) => ({
          description,
          order,
        })),
      },
      images: {
        create: images.map((image, order) => ({
          ...image,
          order,
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

export async function updateProjectBySlug(
  slug: string,
  data: UpdateProjectBody,
) {
  const { technologyIds, features, improvements, images, ...projectData } =
    data;

  return prisma.project.update({
    where: {
      slug,
    },

    data: {
      ...projectData,

      ...(technologyIds !== undefined && {
        technologies: {
          set: technologyIds.map((id) => ({ id })),
        },
      }),

      ...(features !== undefined && {
        features: {
          deleteMany: {},
          create: features.map((feature, order) => ({
            ...feature,
            order,
          })),
        },
      }),

      ...(improvements !== undefined && {
        improvements: {
          deleteMany: {},
          create: improvements.map((description, order) => ({
            description,
            order,
          })),
        },
      }),

      ...(images !== undefined && {
        images: {
          deleteMany: {},
          create: images.map((image, order) => ({
            ...image,
            order,
          })),
        },
      }),
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

      updatedAt: true,
    },
  });
}

export async function deleteProjectBySlug(slug: string) {
  return prisma.project.delete({
    where: {
      slug,
    },
  });
}
