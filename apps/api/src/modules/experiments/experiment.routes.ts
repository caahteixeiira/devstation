import type { FastifyInstance } from "fastify";
import {
  listExperimentsController,
  getExperimentByIdController,
  createExperimentController,
  updateExperimentController,
  deleteExperimentController,
} from "./experiment.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createExperimentController>[0];
type UpdateRequest = Parameters<typeof updateExperimentController>[0];

export async function experimentsRoutes(app: FastifyInstance) {
  app.get("/experiments", listExperimentsController);

  app.get<{
    Params: Parameters<typeof getExperimentByIdController>[0]["params"];
  }>("/experiments/:id", getExperimentByIdController);

  app.post<{ Body: CreateRequest["body"] }>(
    "/experiments",
    { preHandler: requireAdmin },
    createExperimentController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>(
    "/experiments/:id",
    { preHandler: requireAdmin },
    updateExperimentController,
  );

  app.delete<{
    Params: Parameters<typeof deleteExperimentController>[0]["params"];
  }>(
    "/experiments/:id",
    { preHandler: requireAdmin },
    deleteExperimentController,
  );
}
