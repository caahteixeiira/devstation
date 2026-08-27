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