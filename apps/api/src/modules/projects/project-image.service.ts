import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type { readImageUpload } from "../media/image.validation.js";
import { uploadImage, cleanupWarning } from "../media/storage.service.js";
import { queueDeletion } from "../media/storage.repository.js";
import { findImageProject, findProjectImage, lockProject } from "./project-image.repository.js";
import { serializeProjectImage } from "./project-image.serializer.js";

async function requireProject(slug: string) {
  const project = await findImageProject(slug);
  if (!project) throw new AppError("Project not found.", 404);
  return project;
}

export async function uploadProjectImage(slug: string, image: Awaited<ReturnType<typeof readImageUpload>>, imageId?: number) {
  const project = await requireProject(slug);
  if (imageId && !await findProjectImage(project.id, imageId)) throw new AppError("Project image not found.", 404);
  const { buffer, altText, order, ...metadata } = image;
  const record = await uploadImage("projects", project.id, buffer, async (tx, path) => {
    const lockedProject = await lockProject(tx, slug);
    if (lockedProject.id !== project.id) throw new AppError("Project changed. Reload before uploading.", 409);
    const current = imageId ? await tx.projectImage.findFirst({ where: { id: imageId, projectId: project.id } }) : null;
    if (imageId && !current) throw new AppError("Project image not found.", 404);
    if (current?.imagePath) await queueDeletion(tx, current.imagePath);
    const data = { imagePath: path, imageUrl: null, altText, order, ...metadata };
    return current
      ? tx.projectImage.update({ where: { id: current.id }, data })
      : tx.projectImage.create({ data: { projectId: project.id, ...data } });
  });
  return { data: serializeProjectImage(record), warning: await cleanupWarning(`projects/${project.id}/`) };
}

export async function updateProjectImage(slug: string, imageId: number, data: { altText?: string; order?: number }) {
  const record = await prisma.$transaction(async (tx) => {
    const project = await lockProject(tx, slug);
    const image = await tx.projectImage.findFirst({ where: { id: imageId, projectId: project.id } });
    if (!image) throw new AppError("Project image not found.", 404);
    return tx.projectImage.update({ where: { id: imageId }, data });
  });
  return serializeProjectImage(record);
}

export async function deleteProjectImage(slug: string, imageId: number) {
  const projectId = await prisma.$transaction(async (tx) => {
    const project = await lockProject(tx, slug);
    const image = await tx.projectImage.findFirst({ where: { id: imageId, projectId: project.id } });
    if (!image) throw new AppError("Project image not found.", 404);
    if (image.imagePath) await queueDeletion(tx, image.imagePath);
    await tx.projectImage.delete({ where: { id: imageId } });
    return project.id;
  });
  return { warning: await cleanupWarning(`projects/${projectId}/`) };
}
