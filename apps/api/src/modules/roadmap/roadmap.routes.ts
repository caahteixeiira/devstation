import type { FastifyInstance } from "fastify";
import {
  listRoadmapController,
  createRoadmapController,
  updateRoadmapController,
  deleteRoadmapController,
} from "./roadmap.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createRoadmapController>[0];
type UpdateRequest = Parameters<typeof updateRoadmapController>[0];

export async function roadmapRoutes(app: FastifyInstance) {
  app.get("/roadmap", listRoadmapController);

  app.post<{ Body: CreateRequest["body"] }>(
    "/roadmap",
    { preHandler: requireAdmin },
    createRoadmapController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>("/roadmap/:id", { preHandler: requireAdmin }, updateRoadmapController);

  app.delete<{
    Params: Parameters<typeof deleteRoadmapController>[0]["params"];
  }>("/roadmap/:id", { preHandler: requireAdmin }, deleteRoadmapController);
}
