import Fastify from "fastify";
import { AppError } from "./errors/AppError.js";
import { projectRoutes } from "./modules/projects/project.routes.js";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

await app.register(projectRoutes);

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