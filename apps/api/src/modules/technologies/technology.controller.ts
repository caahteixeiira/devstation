import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createNewTechnology,
  listTechnologies,
  updateExistingTechnology,
  deleteExistingTechnology,
} from "./technology.service.js";
import {
  createTechnologyBodySchema,
  technologyIdParamsSchema,
  updateTechnologyBodySchema,
  type CreateTechnologyBody,
  TechnologyIdParams,
  UpdateTechnologyBody,
} from "./technology.schema.js";

export async function listTechnologiesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const technologies = await listTechnologies();

  return reply.status(200).send({
    data: technologies,
  });
}

export async function createTechnologyController(
  request: FastifyRequest<{ Body: CreateTechnologyBody }>,
  reply: FastifyReply,
) {
  const parsed = createTechnologyBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid technology data.",
      errors: parsed.error.flatten(),
    });
  }

  const newTechnology = await createNewTechnology(parsed.data);

  return reply.status(201).send({
    data: newTechnology,
  });
}

export async function updateTechnologyController(
  request: FastifyRequest<{
    Params: TechnologyIdParams;
    Body: UpdateTechnologyBody;
  }>,
  reply: FastifyReply,
) {
  const idTechnology = technologyIdParamsSchema.safeParse(request.params);

  if (!idTechnology.success) {
    return reply.status(400).send({
      message: "Invalid technology id.",
      errors: idTechnology.error.flatten(),
    });
  }

  const upTechnology = updateTechnologyBodySchema.safeParse(request.body);

  if (!upTechnology.success) {
    return reply.status(400).send({
      message: "Invalid technology data.",
      errors: upTechnology.error.flatten(),
    });
  }

  const updatedTechnology = await updateExistingTechnology(
    idTechnology.data.id,
    upTechnology.data,
  );

  return reply.status(200).send({
    data: updatedTechnology,
  });
}

export async function deleteTechnologyController(
  request: FastifyRequest<{
    Params: TechnologyIdParams;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = technologyIdParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid id.",
      errors: parsedParams.error.flatten(),
    });
  }

  await deleteExistingTechnology(parsedParams.data.id);

  return reply.status(204).send();
}
