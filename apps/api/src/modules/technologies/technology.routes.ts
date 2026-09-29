import type { FastifyInstance } from "fastify";
import {
  createTechnologyController,
  listTechnologiesController,
  updateTechnologyController,
  deleteTechnologyController
} from "./technology.controller.js";


export async function technologyRoutes(app: FastifyInstance) {
  app.get("/technologies", listTechnologiesController);
  app.post("/technologies", createTechnologyController);
  app.patch("/technologies/:id", updateTechnologyController);
  app.delete("/technologies/:id",deleteTechnologyController)
}

