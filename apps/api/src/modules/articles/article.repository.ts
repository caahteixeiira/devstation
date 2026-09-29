import { prisma } from "../../lib/prisma.js";
import type { CreateArticleBody } from "./article.schema.js";

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

export async function createArticle(data: CreateArticleBody) {
  return prisma.article.create({
    data,
  });
}