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