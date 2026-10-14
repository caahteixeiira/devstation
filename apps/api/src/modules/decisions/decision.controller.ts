import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createDecisionBodySchema,
  updateDecisionBodySchema,
  decisionProjectParamsSchema,
  decisionIdParamsSchema,
  type CreateDecisionBody,
  type UpdateDecisionBody,
  type DecisionProjectParams,
  type DecisionIdParams,
} from "./decision.schema.js";
import {
  listProjectDecisions,
  createNewDecision,
  updateExistingDecision,
  deleteExistingDecision,
} from "./decision.service.js";

export async function listDecisionsController(
  request: FastifyRequest<{ Params: DecisionProjectParams }>,
  reply: FastifyReply,
) {
  const parsed = decisionProjectParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid project ID.",
      errors: parsed.error.flatten(),
    });
  }

  const decisions = await listProjectDecisions(parsed.data.projectId);

  return reply.status(200).send({ data: decisions });
}

export async function createDecisionController(
  request: FastifyRequest<{
    Params: DecisionProjectParams;
    Body: CreateDecisionBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = decisionProjectParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid project ID.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = createDecisionBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid decision data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const decision = await createNewDecision(
    parsedParams.data.projectId,
    parsedBody.data,
  );

  return reply.status(201).send({ data: decision });
}

export async function updateDecisionController(
  request: FastifyRequest<{
    Params: DecisionIdParams;
    Body: UpdateDecisionBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = decisionIdParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid decision ID.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = updateDecisionBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid decision data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const decision = await updateExistingDecision(
    parsedParams.data.id,
    parsedBody.data,
  );

  return reply.status(200).send({ data: decision });
}

export async function deleteDecisionController(
  request: FastifyRequest<{ Params: DecisionIdParams }>,
  reply: FastifyReply,
) {
  const parsed = decisionIdParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid decision ID.",
      errors: parsed.error.flatten(),
    });
  }

  await deleteExistingDecision(parsed.data.id);

  return reply.status(204).send();
}
