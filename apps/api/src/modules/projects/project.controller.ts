import type { FastifyReply, FastifyRequest } from "fastify";

import { listProjects } from "./project.service.js";

export async function listProjectsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const projects = await listProjects();

  return reply.status(200).send({
    data: projects,
  });
}