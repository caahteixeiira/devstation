import type { FastifyInstance } from "fastify";
import {
  createExperienceController,
  listExperiencesController,
  updateExperienceController,
  deleteExperienceController,
} from "./experience.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createExperienceController>[0];
type UpdateRequest = Parameters<typeof updateExperienceController>[0];

export async function experiencesRoutes(app: FastifyInstance) {
  app.get("/experiences", listExperiencesController);

  app.post<{ Body: CreateRequest["body"] }>(
    "/experiences",
    { preHandler: requireAdmin },
    createExperienceController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>(
    "/experiences/:id",
    { preHandler: requireAdmin },
    updateExperienceController,
  );

  app.delete<{
    Params: Parameters<typeof deleteExperienceController>[0]["params"];
  }>(
    "/experiences/:id",
    { preHandler: requireAdmin },
    deleteExperienceController,
  );
}
