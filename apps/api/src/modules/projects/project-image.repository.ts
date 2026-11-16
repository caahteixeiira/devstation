import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/AppError.js";

export async function lockProject(tx: Prisma.TransactionClient, slug: string) {
  await tx.$queryRaw`SELECT id FROM "Project" WHERE slug = ${slug} FOR UPDATE`;
  const project = await tx.project.findUnique({ where: { slug } });
  if (!project) throw new AppError("Project not found.", 404);
  return project;
}
export const findProjectImage = (projectId: number, id: number) => prisma.projectImage.findFirst({ where: { id, projectId } });
export const findImageProject = (slug: string) => prisma.project.findUnique({ where: { slug }, select: { id: true } });
