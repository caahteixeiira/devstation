import type { FastifyReply, FastifyRequest } from "fastify";

import { createNewArticle, listArticles } from "./article.service.js";
import {
  createArticleBodySchema,
  type CreateArticleBody,
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
