import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createExperienceBodySchema,
  type CreateExperienceBody,
  experienceIdParamsSchema,
  updateExperienceBodySchema,
  type ExperienceIdParams,
  type UpdateExperienceBody,
} from "./experience.schema.js";
import {
  createNewExperience,
  updateExistingExperience,
  deleteExistingExperience,
  listExperiences,
} from "./experience.service.js";

export async function createExperienceController(
  request: FastifyRequest<{ Body: CreateExperienceBody }>,
  reply: FastifyReply,
) {
  const parsed = createExperienceBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid experience data.",
      errors: parsed.error.flatten(),
    });
  }

  const experience = await createNewExperience(parsed.data);

  return reply.status(201).send({
    data: experience,
  });
}

export async function listExperiencesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const experiences = await listExperiences();

  return reply.status(200).send({
    data: experiences,
  });
}

export async function updateExperienceController(
  request: FastifyRequest<{
    Params: ExperienceIdParams;
    Body: UpdateExperienceBody;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = experienceIdParamsSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return reply.status(400).send({
      message: "Invalid experience ID.",
      errors: parsedParams.error.flatten(),
    });
  }

  const parsedBody = updateExperienceBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({
      message: "Invalid experience data.",
      errors: parsedBody.error.flatten(),
    });
  }

  const experience = await updateExistingExperience(
    parsedParams.data.id,
    parsedBody.data,
  );

  return reply.status(200).send({
    data: experience,
  });
}

export async function deleteExperienceController(
  request: FastifyRequest<{
    Params: ExperienceIdParams;
  }>,
  reply: FastifyReply,
) {
  const parsed = experienceIdParamsSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid experience ID.",
      errors: parsed.error.flatten(),
    });
  }

  await deleteExistingExperience(parsed.data.id);

  return reply.status(204).send();
}
