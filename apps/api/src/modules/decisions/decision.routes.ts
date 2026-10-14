import type { FastifyInstance } from "fastify";
import {
  listDecisionsController,
  createDecisionController,
  updateDecisionController,
  deleteDecisionController,
} from "./decision.controller.js";

export async function decisionsRoutes(app: FastifyInstance) {
  app.get("/projects/:projectId/decisions", listDecisionsController);
  app.post("/projects/:projectId/decisions", createDecisionController);
  app.patch("/decisions/:id", updateDecisionController);
  app.delete("/decisions/:id", deleteDecisionController);
}
