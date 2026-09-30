import { prisma } from "../../lib/prisma.js";
import type { CreateArticleBody } from "./article.schema.js";

type CreateArticleData = CreateArticleBody & {
  publishedAt: Date | null;
};

export async function projectExistsById(id: number) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

export async function articleExistsBySlug(slug: string) {
  return prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });
}

export async function createArticle(data: CreateArticleData) {
  return prisma.article.create({
    data,
  });
}

export async function findAllArticles() {
  return prisma.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      category: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
