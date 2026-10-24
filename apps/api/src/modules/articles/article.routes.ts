import type { FastifyInstance } from "fastify";
import {
  createArticleController,
  getArticleBySlugController,
  listArticlesController,
  updateArticleController,
  deleteArticleController,
  listArticlesForAdminController,
getArticleBySlugForAdminController,
} from "./article.controller.js";
import type {
  CreateArticleBody,
  UpdateArticleBody,
  ArticleSlugParams,
} from "./article.schema.js";
import { requireAdmin } from "../auth/auth.middleware.js";

export async function articlesRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateArticleBody }>(
    "/articles",
    { preHandler: requireAdmin },
    createArticleController,
  );

  app.get("/articles", listArticlesController);

  app.get<{ Params: ArticleSlugParams }>(
    "/articles/:slug",
    getArticleBySlugController,
  );

  app.patch<{
    Params: ArticleSlugParams;
    Body: UpdateArticleBody;
  }>("/articles/:slug", { preHandler: requireAdmin }, updateArticleController);

  app.delete<{ Params: ArticleSlugParams }>(
    "/articles/:slug",
    { preHandler: requireAdmin },
    deleteArticleController,
  );
  app.get(
  "/admin/articles",
  { preHandler: requireAdmin },
  listArticlesForAdminController,
);

app.get<{ Params: ArticleSlugParams }>(
  "/admin/articles/:slug",
  { preHandler: requireAdmin },
  getArticleBySlugForAdminController,
);
}
