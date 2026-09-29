import type { FastifyInstance } from "fastify";
import {
  createProjectController,
  deleteProjectController,
  getProjectBySlugController,
  listProjectsController,
  updateProjectController,
} from "./project.controller.js";


export async function projectRoutes(app: FastifyInstance) {
  app.get("/projects", listProjectsController);
  app.get("/projects/:slug", getProjectBySlugController);

  app.post("/projects", createProjectController);
  app.patch("/projects/:slug", updateProjectController);
  app.delete("/projects/:slug", deleteProjectController);
}
