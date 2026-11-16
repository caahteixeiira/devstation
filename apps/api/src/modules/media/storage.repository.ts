import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export async function queueDeletion(tx: Prisma.TransactionClient, path: string) {
  await tx.storageCleanup.upsert({ where: { path }, create: { path }, update: { notBefore: new Date() } });
}

export const reserveUpload = (path: string) => prisma.storageCleanup.create({
  data: { path, notBefore: new Date(Date.now() + 60 * 60 * 1000) },
});

export const pendingDeletions = (prefix?: string) => prisma.storageCleanup.findMany({
  where: { notBefore: { lte: new Date() }, ...(prefix ? { path: { startsWith: prefix } } : {}) },
  orderBy: { createdAt: "asc" }, take: 3,
});

export const removeDeletion = (id: number) => prisma.storageCleanup.deleteMany({ where: { id } });
export const countDeletions = (prefix?: string, dueOnly = false) => prisma.storageCleanup.count({
  where: { ...(prefix ? { path: { startsWith: prefix } } : {}), ...(dueOnly ? { notBefore: { lte: new Date() } } : {}) },
});
export const recordDeletionFailure = (id: number) => prisma.storageCleanup.updateMany({
  where: { id }, data: { attempts: { increment: 1 } },
});

export async function isImageReferenced(path: string, tx: Prisma.TransactionClient = prisma) {
  const [certification, image] = await Promise.all([
    tx.certification.findFirst({ where: { imagePath: path }, select: { id: true } }),
    tx.projectImage.findFirst({ where: { imagePath: path }, select: { id: true } }),
  ]);
  return Boolean(certification || image);
}
