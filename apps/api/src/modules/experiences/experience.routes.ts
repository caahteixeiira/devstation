import type { FastifyInstance } from "fastify";
import {
  createExperienceController,
  deleteExperienceController,
  updateExperienceController,
} from "./experience.controller.js";
import { listExperiencesController } from "./experience.controller.js";

export async function experiencesRoutes(app: FastifyInstance) {
  app.post("/experiences", createExperienceController);
  app.get("/experiences", listExperiencesController);
  app.patch("/experiences/:id", updateExperienceController);
  app.delete("/experiences/:id", deleteExperienceController);
}
