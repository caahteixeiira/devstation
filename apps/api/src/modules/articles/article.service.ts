import { AppError } from "../../errors/AppError.js";

import {
  projectExistsById,
  articleExistsBySlug,
  createArticle,
  findArticleBySlugAndStatus,
  findArticlesByStatus,
  findArticleBySlug,
  updateArticle,
  deleteArticle,
} from "./article.repository.js";

import type { CreateArticleBody, UpdateArticleBody } from "./article.schema.js";

export async function createNewArticle(data: CreateArticleBody) {
  const projectExists = await projectExistsById(data.projectId);

  if (!projectExists) {
    throw new AppError("Project not found.", 404);
  }

  const articleAlreadyExists = await articleExistsBySlug(data.slug);

  if (articleAlreadyExists) {
    throw new AppError("Slug already exists.", 409);
  }

  if (data.status === "ARCHIVED") {
    throw new AppError("Article cannot be created as archived.", 400);
  }

  const publishedAt = data.status === "PUBLISHED" ? new Date() : null;

  return createArticle({
    ...data,
    publishedAt,
  });
}

export async function listArticles() {
  return findArticlesByStatus("PUBLISHED");
}

export async function getArticleBySlug(slug: string) {
  const article = await findArticleBySlugAndStatus(
    slug,
    "PUBLISHED",
  );

  if (!article) {
    throw new AppError("Article not found.", 404);
  }

  return article;
}

export async function updateExistingArticle(
  slug: string,
  data: UpdateArticleBody,
) {
  const article = await findArticleBySlug(slug);

  if (!article) {
    throw new AppError("Article not found.", 404);
  }

  if (data.slug && data.slug !== slug) {
    const slugAlreadyExists = await articleExistsBySlug(data.slug);

    if (slugAlreadyExists) {
      throw new AppError("Slug already exists.", 409);
    }
  }

  if (data.projectId !== undefined && data.projectId !== article.projectId) {
    const projectExists = await projectExistsById(data.projectId);

    if (!projectExists) {
      throw new AppError("Project not found.", 404);
    }
  }

  const finalStatus = data.status ?? article.status;
  let publishedAt = article.publishedAt;

  if (finalStatus === "PUBLISHED" && article.publishedAt === null) {
    publishedAt = new Date();
  }

  return updateArticle(slug, {
    ...data,
    publishedAt,
  });
}

export async function deleteExistingArticle(slug: string) {
  const article = await findArticleBySlug(slug);

  if (!article) {
    throw new AppError("Article not found.", 404);
  }

  return deleteArticle(slug);
}