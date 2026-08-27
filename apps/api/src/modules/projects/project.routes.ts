import type { FastifyInstance } from "fastify";

import { listProjectsController } from "./project.controller.js";

export async function projectRoutes(app: FastifyInstance) {
  app.get("/projects", listProjectsController);
}