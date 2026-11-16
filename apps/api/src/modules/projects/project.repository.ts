import { prisma } from "../../lib/prisma.js";
import type { CreateProjectBody, UpdateProjectBody } from "./project.schema.js";
import { lockProject } from "./project-image.repository.js";
import { queueDeletion } from "../media/storage.repository.js";

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
  const project = await prisma.project.findUnique({
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
        orderBy: [{ order: "asc" }, { id: "asc" }],
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
  return project;
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

  return prisma.$transaction(async (tx) => {
    await lockProject(tx, slug);
    // Legacy URL arrays may replace legacy rows only. Managed images have
    // dedicated endpoints, so saving editorial content cannot erase uploads.
    const legacyImages = images?.filter((image) => !image.imageUrl.includes("/storage/v1/object/"));
    return tx.project.update({
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

        ...(legacyImages !== undefined && {
          images: {
            deleteMany: { imagePath: null },
            create: legacyImages.map((image, order) => ({
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
  });
}

export async function deleteProjectBySlug(slug: string) {
  const project = await prisma.$transaction(async (tx) => {
    const current = await lockProject(tx, slug);
    const images = await tx.projectImage.findMany({ where: { projectId: current.id } });
    for (const image of images) if (image.imagePath) await queueDeletion(tx, image.imagePath);
    return tx.project.delete({ where: { slug } });
  });
  return project;
}
