import { AppError } from "../../errors/AppError.js";

import {
  projectExistsById,
  articleExistsBySlug,
  createArticle,
  findAllArticles,
} from "./article.repository.js";

import type { CreateArticleBody } from "./article.schema.js";

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
  return findAllArticles();
}
