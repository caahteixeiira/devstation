import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { AppError } from "../../errors/AppError.js";
import { readImageUpload } from "../media/image.validation.js";
import { projectSlugParamsSchema } from "./project.schema.js";
import * as service from "./project-image.service.js";

function params(input: unknown, needsId = true) {
  const parsed = projectSlugParamsSchema.extend({ imageId: z.coerce.number().int().positive().max(2_147_483_647).optional() }).safeParse(input);
  if (!parsed.success || (needsId && !parsed.data.imageId)) throw new AppError("Invalid project image parameters.", 400);
  return parsed.data;
}
export async function uploadProjectImageController(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = params(request.params, false);
  return reply.status(201).send(await service.uploadProjectImage(slug, await readImageUpload(request)));
}
export async function replaceProjectImageController(request: FastifyRequest, reply: FastifyReply) {
  const { slug, imageId } = params(request.params);
  return reply.send(await service.uploadProjectImage(slug, await readImageUpload(request), imageId!));
}
export async function updateProjectImageController(request: FastifyRequest, reply: FastifyReply) {
  const { slug, imageId } = params(request.params);
  const parsed = z.object({ altText: z.string().trim().min(2).max(500).optional(), order: z.number().int().min(0).max(10000).optional() }).strict().refine((data) => Object.keys(data).length > 0).safeParse(request.body);
  if (!parsed.success) throw new AppError("Invalid image metadata.", 400);
  return reply.send({ data: await service.updateProjectImage(slug, imageId!, parsed.data) });
}
export async function deleteProjectImageController(request: FastifyRequest, reply: FastifyReply) {
  const { slug, imageId } = params(request.params);
  return reply.send({ data: null, ...await service.deleteProjectImage(slug, imageId!) });
}
