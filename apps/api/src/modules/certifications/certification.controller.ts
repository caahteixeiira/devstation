import type { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../../errors/AppError.js";
import { readImageUpload } from "../media/image.validation.js";
import { certificationIdSchema, createCertificationSchema, updateCertificationSchema } from "./certification.schema.js";
import * as service from "./certification.service.js";

export function certificationId(params: unknown) {
  const result = certificationIdSchema.safeParse(params);
  if (!result.success) throw new AppError("Invalid certification ID.", 400);
  return result.data.id;
}
export async function listCertificationsController(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ data: await service.listCertifications() });
}
export async function listAdminCertificationsController(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ data: await service.listCertifications(true) });
}
export async function getCertificationController(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ data: await service.getCertification(certificationId(request.params)) });
}
export async function getAdminCertificationController(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ data: await service.getCertification(certificationId(request.params), true) });
}
export async function createCertificationController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createCertificationSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ message: "Invalid certification data.", errors: parsed.error.flatten() });
  return reply.status(201).send({ data: await service.createCertification(parsed.data) });
}
export async function updateCertificationController(request: FastifyRequest, reply: FastifyReply) {
  const id = certificationId(request.params);
  const parsed = updateCertificationSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ message: "Invalid certification data.", errors: parsed.error.flatten() });
  return reply.send({ data: await service.updateCertification(id, parsed.data) });
}
export async function deleteCertificationController(request: FastifyRequest, reply: FastifyReply) {
  await service.deleteCertification(certificationId(request.params));
  return reply.status(204).send();
}
export async function uploadCertificationImageController(request: FastifyRequest, reply: FastifyReply) {
  const id = certificationId(request.params);
  await service.getCertification(id);
  return reply.send(await service.uploadCertificationImage(id, await readImageUpload(request)));
}
export async function removeCertificationImageController(request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await service.removeCertificationImage(certificationId(request.params)));
}
