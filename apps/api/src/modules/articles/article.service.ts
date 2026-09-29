import { AppError } from "../../errors/AppError.js";

import {
  projectExistsById,
  articleExistsBySlug,
  createArticle,
} from "./article.repository.js";

import type { CreateArticleBody } from "./article.schema.js";

export async function createNewArticle(data: CreateArticleBody) {
  const articleAlreadyExists = await projectExistsById(data.projectId)

  if(articleAlreadyExists) {
    throw new AppError("Article already exists.", 404)
  }
  return createNewArticle(data);
}

export async function getProjectBySlug(slug: string) {
  return articleExistsBySlug(slug);
}

