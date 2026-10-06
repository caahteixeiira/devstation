import type { FastifyReply, FastifyRequest } from "fastify";

import { createNewArticle, listArticles, getArticleBySlug, updateExistingArticle, deleteExistingArticle } from "./article.service.js";
import {
  createArticleBodySchema,
  articleSlugParamsSchema,
  updateArticleBodySchema,
  type CreateArticleBody, 
  type ArticleSlugParams,
  type UpdateArticleBody,
} from "./article.schema.js";

export async function createArticleController(
  request: FastifyRequest<{
    Body: CreateArticleBody;
  }>,
  reply: FastifyReply,
) {
  const parsed = createArticleBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid article data.",
      errors: parsed.error.flatten(),
    });
  }

  const article = await createNewArticle(parsed.data);

  return reply.status(201).send({
    data: article,
  });
}

export async function listArticlesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const articles = await listArticles();

  return reply.status(200).send({
    data: articles,
  });
}

export async function getArticleBySlugController(
  request: FastifyRequest<{
  Params: ArticleSlugParams;
}>,
  reply: FastifyReply,
) {
  const parsed = articleSlugParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid article slug.",
      errors: parsed.error.flatten(),
    });
  }

  const article = await getArticleBySlug(parsed.data.slug);

  return reply.status(200).send({
    data: article,
  });
}

export async function updateArticleController(
  request: FastifyRequest<{
    Params: ArticleSlugParams;
    Body: UpdateArticleBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = articleSlugParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid article slug.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = updateArticleBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid article data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const article = await updateExistingArticle(
    parsedParams.data.slug,
    parsedBody.data,
  );

  return reply.status(200).send({
    data: article,
  });
}

export async function deleteArticleController(
  request: FastifyRequest<{
    Params: ArticleSlugParams;
  }>,
  reply: FastifyReply,
) {
  const parsed = articleSlugParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid article slug.",
      errors: parsed.error.flatten(),
    });
  }

  await deleteExistingArticle(parsed.data.slug);

  return reply.status(204).send();
}
