import type { FastifyInstance } from "fastify";
import {
  createArticleController,
  listArticlesController,
} from "./article.controller.js";

export async function articlesRoutes(app: FastifyInstance) {
  app.post("/articles", createArticleController);
  app.get("/articles", listArticlesController);
}
