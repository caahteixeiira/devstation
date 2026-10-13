import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createExperimentBodySchema,
  updateExperimentBodySchema,
  experimentIdParamsSchema,
  type CreateExperimentBody,
  type UpdateExperimentBody,
  type ExperimentIdParams,
} from "./experiment.schema.js";
import {
  listExperiments,
  getExperimentById,
  createNewExperiment,
  updateExistingExperiment,
  deleteExistingExperiment,
} from "./experiment.service.js";

export async function listExperimentsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const experiments = await listExperiments();

  return reply.status(200).send({ data: experiments });
}

export async function getExperimentByIdController(
  request: FastifyRequest<{ Params: ExperimentIdParams }>,
  reply: FastifyReply,
) {
  const parsed = experimentIdParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid experiment ID.",
      errors: parsed.error.flatten(),
    });
  }

  const experiment = await getExperimentById(parsed.data.id);

  return reply.status(200).send({ data: experiment });
}

export async function createExperimentController(
  request: FastifyRequest<{ Body: CreateExperimentBody }>,
  reply: FastifyReply,
) {
  const parsed = createExperimentBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid experiment data.",
      errors: parsed.error.flatten(),
    });
  }

  const experiment = await createNewExperiment(parsed.data);

  return reply.status(201).send({ data: experiment });
}

export async function updateExperimentController(
  request: FastifyRequest<{
    Params: ExperimentIdParams;
    Body: UpdateExperimentBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = experimentIdParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid experiment ID.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = updateExperimentBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid experiment data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const experiment = await updateExistingExperiment(
    parsedParams.data.id,
    parsedBody.data,
  );

  return reply.status(200).send({ data: experiment });
}

export async function deleteExperimentController(
  request: FastifyRequest<{ Params: ExperimentIdParams }>,
  reply: FastifyReply,
) {
  const parsed = experimentIdParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid experiment ID.",
      errors: parsed.error.flatten(),
    });
  }

  await deleteExistingExperiment(parsed.data.id);

  return reply.status(204).send();
}
