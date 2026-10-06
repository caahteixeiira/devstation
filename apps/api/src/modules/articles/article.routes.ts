import type { FastifyInstance } from "fastify";
import {
  createArticleController,
  getArticleBySlugController,
  listArticlesController,
  updateArticleController,
  deleteArticleController,
} from "./article.controller.js";

export async function articlesRoutes(app: FastifyInstance) {
  app.post("/articles", createArticleController);
  app.get("/articles", listArticlesController);
  app.get("/articles/:slug", getArticleBySlugController);
  app.patch("/articles/:slug", updateArticleController);
  app.delete("/articles/:slug", deleteArticleController);
}
