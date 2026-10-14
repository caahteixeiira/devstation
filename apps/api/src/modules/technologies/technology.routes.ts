import type { FastifyInstance } from "fastify";
import {
  createTechnologyController,
  listTechnologiesController,
  updateTechnologyController,
  deleteTechnologyController,
} from "./technology.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

type CreateRequest = Parameters<typeof createTechnologyController>[0];
type UpdateRequest = Parameters<typeof updateTechnologyController>[0];

export async function technologyRoutes(app: FastifyInstance) {
  app.get("/technologies", listTechnologiesController);

  app.post<{ Body: CreateRequest["body"] }>(
    "/technologies",
    { preHandler: requireAdmin },
    createTechnologyController,
  );

  app.patch<{
    Params: UpdateRequest["params"];
    Body: UpdateRequest["body"];
  }>(
    "/technologies/:id",
    { preHandler: requireAdmin },
    updateTechnologyController,
  );

  app.delete<{
    Params: Parameters<typeof deleteTechnologyController>[0]["params"];
  }>(
    "/technologies/:id",
    { preHandler: requireAdmin },
    deleteTechnologyController,
  );
}
