import type { FastifyInstance } from "fastify";
import {
  createProjectController,
  deleteProjectController,
  getProjectBySlugController,
  listProjectsController,
  updateProjectController,
} from "./project.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createProjectController>[0];
type UpdateRequest = Parameters<typeof updateProjectController>[0];

export async function projectRoutes(app: FastifyInstance) {
  app.get("/projects", listProjectsController);

  app.get<{
    Params: Parameters<typeof getProjectBySlugController>[0]["params"];
  }>("/projects/:slug", getProjectBySlugController);

  app.post<{ Body: CreateRequest["body"] }>(
    "/projects",
    { preHandler: requireAdmin },
    createProjectController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>("/projects/:slug", { preHandler: requireAdmin }, updateProjectController);

  app.delete<{
    Params: Parameters<typeof deleteProjectController>[0]["params"];
  }>("/projects/:slug", { preHandler: requireAdmin }, deleteProjectController);
}
