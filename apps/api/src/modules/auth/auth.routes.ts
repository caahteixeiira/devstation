import type { FastifyInstance } from "fastify";
import { loginController, meController } from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", {
    config: {
      rateLimit: { max: 10, timeWindow: "15 minutes" },
    },
  }, loginController);

  app.get("/auth/me", { preHandler: requireAuth }, meController);
}
