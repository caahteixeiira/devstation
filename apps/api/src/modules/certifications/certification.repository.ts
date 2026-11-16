import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/AppError.js";
import { queueDeletion } from "../media/storage.repository.js";
import type { CreateCertification, UpdateCertification } from "./certification.schema.js";

export const certificationInclude = { technologies: { select: { id: true, name: true, category: true } } } as const;

export const findCertifications = (admin = false) => prisma.certification.findMany({
  where: admin ? {} : { deleting: false }, include: certificationInclude,
  orderBy: [{ featured: "desc" }, { order: "asc" }, { issueDate: "desc" }, { id: "asc" }],
});
export const findCertification = (id: number) => prisma.certification.findUnique({ where: { id }, include: certificationInclude });

export async function lockCertification(tx: Prisma.TransactionClient, id: number, allowDeleting = false) {
  await tx.$queryRaw`SELECT id FROM "Certification" WHERE id = ${id} FOR UPDATE`;
  const existing = await tx.certification.findUnique({ where: { id } });
  if (!existing) throw new AppError("Certification not found.", 404);
  if (existing.deleting && !allowDeleting) throw new AppError("Certification deletion is pending. Retry deletion first.", 409);
  return existing;
}

async function validateTechnologies(tx: Prisma.TransactionClient, ids: number[]) {
  const unique = [...new Set(ids)];
  if (await tx.technology.count({ where: { id: { in: unique } } }) !== unique.length) {
    throw new AppError("One or more technologies were not found.", 400);
  }
  return unique.map((id) => ({ id }));
}

function validateDates(issueDate: Date, expirationDate?: Date | null) {
  if (expirationDate && expirationDate < issueDate) throw new AppError("Expiration date must not precede issue date.", 400);
}

export async function insertCertification(data: CreateCertification) {
  validateDates(data.issueDate, data.expirationDate);
  return prisma.$transaction(async (tx) => {
    const { technologyIds, ...fields } = data;
    const technologies = await validateTechnologies(tx, technologyIds);
    return tx.certification.create({ data: { ...fields, technologies: { connect: technologies } }, include: certificationInclude });
  });
}

export async function editCertification(id: number, data: UpdateCertification) {
  return prisma.$transaction(async (tx) => {
    const current = await lockCertification(tx, id);
    validateDates(data.issueDate ?? current.issueDate, data.expirationDate === undefined ? current.expirationDate : data.expirationDate);
    const { technologyIds, ...fields } = data;
    const technologies = technologyIds === undefined ? undefined : await validateTechnologies(tx, technologyIds);
    return tx.certification.update({ where: { id }, data: { ...fields, ...(technologies ? { technologies: { set: technologies } } : {}) }, include: certificationInclude });
  });
}

export async function detachCertificationImage(id: number, deleting = false) {
  return prisma.$transaction(async (tx) => {
    const current = await lockCertification(tx, id, deleting);
    if (current.imagePath) await queueDeletion(tx, current.imagePath);
    return tx.certification.update({
      where: { id }, data: { imagePath: null, contentType: null, sizeBytes: null, width: null, height: null, ...(deleting ? { deleting: true } : {}) },
      include: certificationInclude,
    });
  });
}

export async function deleteCertificationRecord(id: number) {
  return prisma.$transaction(async (tx) => {
    const current = await lockCertification(tx, id, true);
    if (!current.deleting || current.imagePath) throw new AppError("Retry the certification deletion.", 409);
    await tx.certification.delete({ where: { id } });
  });
}
