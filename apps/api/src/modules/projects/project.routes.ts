import type { FastifyInstance } from "fastify";
import {
  createProjectController,
  getProjectBySlugController,
  listProjectsController,
} from "./project.controller.js";


export async function projectRoutes(app: FastifyInstance) {
  app.get("/projects", listProjectsController);
  app.get("/projects/:slug", getProjectBySlugController);

  app.post("/projects", createProjectController);
}