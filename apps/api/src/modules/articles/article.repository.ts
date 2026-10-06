import type { ArticleStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateArticleBody,
  UpdateArticleBody,
} from "./article.schema.js";

type CreateArticleData = CreateArticleBody & {
  publishedAt: Date | null;
};

type UpdateArticleData = UpdateArticleBody & {
  publishedAt: Date | null;
};

export async function projectExistsById(id: number) {
  return prisma.project.findUnique({
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

export async function findArticlesByStatus(status: ArticleStatus) {
  return prisma.article.findMany({
    where: {
      status,
    },
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

export async function findArticleBySlugAndStatus(
  slug: string,
  status: ArticleStatus,
) {
  return prisma.article.findUnique({
    where: {
      slug,
      status,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      category: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      content: true,
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}


export async function findArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: {
      slug,
    },
  });
}

export async function updateArticle(slug: string, data: UpdateArticleData) {
  return prisma.article.update({
    where: {
      slug,
    },
    data,
  });
}

export async function deleteArticle(slug: string) {
  return prisma.article.delete({
    where: {
      slug,
    },
  });
}