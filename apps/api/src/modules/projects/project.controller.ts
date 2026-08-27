import type { FastifyReply, FastifyRequest } from "fastify";
import {
  getProjectBySlug,
  listProjects,
} from "./project.service.js";
import {
  projectSlugParamsSchema,
  type ProjectSlugParams,
} from "./project.schema.js";

export async function listProjectsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const projects = await listProjects();

  return reply.status(200).send({
    data: projects,
  });
}

export async function getProjectBySlugController(
  request: FastifyRequest<{ Params: ProjectSlugParams }>,
  reply: FastifyReply,
) {
  const parsed = projectSlugParamsSchema.safeParse(
    request.params,
  );

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid project slug.",
      errors: parsed.error.flatten(),
    });
  }

  const project = await getProjectBySlug(
    parsed.data.slug,
  );

  if (!project) {
    return reply.status(404).send({
      message: "Project not found.",
    });
  }

  return reply.status(200).send({
    data: project,
  });
}