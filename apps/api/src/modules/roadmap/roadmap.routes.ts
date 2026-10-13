import type { FastifyInstance } from "fastify";
import {
  listRoadmapController,
  createRoadmapController,
  updateRoadmapController,
  deleteRoadmapController,
} from "./roadmap.controller.js";

export async function roadmapRoutes(app: FastifyInstance) {
  app.get("/roadmap", listRoadmapController);
  app.post("/roadmap", createRoadmapController);
  app.patch("/roadmap/:id", updateRoadmapController);
  app.delete("/roadmap/:id", deleteRoadmapController);
}
