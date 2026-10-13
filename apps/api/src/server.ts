import Fastify from "fastify";
import { AppError } from "./errors/AppError.js";
import { projectRoutes } from "./modules/projects/project.routes.js";
import { technologyRoutes } from "./modules/technologies/technology.routes.js";
import { articlesRoutes } from "./modules/articles/article.routes.js";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { experiencesRoutes } from "./modules/experiences/experience.routes.js";
import { roadmapRoutes } from "./modules/roadmap/roadmap.routes.js";
import { experimentsRoutes } from "./modules/experiments/experiment.routes.js";

const app = Fastify({
  logger: true,
});

await app.register(helmet);

await app.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE"],
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

await app.register(projectRoutes);
await app.register(technologyRoutes);
await app.register(articlesRoutes);
await app.register(experiencesRoutes);
await app.register(roadmapRoutes);
await app.register(experimentsRoutes);

const start = async () => {
  try {
    await app.listen({
      port: 3333,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  app.log.error(error);

  return reply.status(500).send({
    message: "Internal server error.",
  });
});

start();
