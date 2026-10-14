import type { FastifyInstance } from "fastify";
import {
  listDecisionsController,
  createDecisionController,
  updateDecisionController,
  deleteDecisionController,
} from "./decision.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createDecisionController>[0];
type UpdateRequest = Parameters<typeof updateDecisionController>[0];

export async function decisionsRoutes(app: FastifyInstance) {
  app.get<{ Params: CreateRequest["params"] }>(
    "/projects/:projectId/decisions",
    listDecisionsController,
  );

  app.post<{
    Params: CreateRequest["params"];
    Body: CreateRequest["body"];
  }>(
    "/projects/:projectId/decisions",
    { preHandler: requireAdmin },
    createDecisionController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>("/decisions/:id", { preHandler: requireAdmin }, updateDecisionController);

  app.delete<{
    Params: Parameters<typeof deleteDecisionController>[0]["params"];
  }>("/decisions/:id", { preHandler: requireAdmin }, deleteDecisionController);
}
