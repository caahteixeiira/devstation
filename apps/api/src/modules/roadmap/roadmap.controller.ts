import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createRoadmapBodySchema,
  updateRoadmapBodySchema,
  roadmapIdParamsSchema,
  type CreateRoadmapBody,
  type UpdateRoadmapBody,
  type RoadmapIdParams,
} from "./roadmap.schema.js";
import {
  listRoadmapItems,
  createNewRoadmapItem,
  updateExistingRoadmapItem,
  deleteExistingRoadmapItem,
} from "./roadmap.service.js";

export async function listRoadmapController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const items = await listRoadmapItems();

  return reply.status(200).send({ data: items });
}

export async function createRoadmapController(
  request: FastifyRequest<{ Body: CreateRoadmapBody }>,
  reply: FastifyReply,
) {
  const parsed = createRoadmapBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid roadmap data.",
      errors: parsed.error.flatten(),
    });
  }

  const item = await createNewRoadmapItem(parsed.data);

  return reply.status(201).send({ data: item });
}

export async function updateRoadmapController(
  request: FastifyRequest<{
    Params: RoadmapIdParams;
    Body: UpdateRoadmapBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = roadmapIdParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid roadmap ID.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = updateRoadmapBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid roadmap data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const item = await updateExistingRoadmapItem(
    parsedParams.data.id,
    parsedBody.data,
  );

  return reply.status(200).send({ data: item });
}

export async function deleteRoadmapController(
  request: FastifyRequest<{ Params: RoadmapIdParams }>,
  reply: FastifyReply,
) {
  const parsed = roadmapIdParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid roadmap ID.",
      errors: parsed.error.flatten(),
    });
  }

  await deleteExistingRoadmapItem(parsed.data.id);

  return reply.status(204).send();
}
