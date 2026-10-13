import type { FastifyInstance } from "fastify";
import {
  listExperimentsController,
  getExperimentByIdController,
  createExperimentController,
  updateExperimentController,
  deleteExperimentController,
} from "./experiment.controller.js";

export async function experimentsRoutes(app: FastifyInstance) {
  app.get("/experiments", listExperimentsController);
  app.get("/experiments/:id", getExperimentByIdController);
  app.post("/experiments", createExperimentController);
  app.patch("/experiments/:id", updateExperimentController);
  app.delete("/experiments/:id", deleteExperimentController);
}
