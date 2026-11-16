import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../auth/auth.middleware.js";
import { flushStorageCleanup } from "./storage.service.js";
import * as images from "../projects/project-image.controller.js";

export async function mediaRoutes(app: FastifyInstance) {
  const admin = { onRequest: requireAdmin };
  app.post("/projects/:slug/images", admin, images.uploadProjectImageController);
  app.post("/projects/:slug/images/:imageId", admin, images.replaceProjectImageController);
  app.patch("/projects/:slug/images/:imageId", admin, images.updateProjectImageController);
  app.delete("/projects/:slug/images/:imageId", admin, images.deleteProjectImageController);
  app.post("/storage/cleanup", admin, async () => ({ data: await flushStorageCleanup() }));
}
