import { storage } from "../../lib/supabase.js";
import { AppError } from "../../errors/AppError.js";
import { uploadImage, cleanupWarning, flushStorageCleanup } from "../media/storage.service.js";
import { queueDeletion } from "../media/storage.repository.js";
import type { readImageUpload } from "../media/image.validation.js";
import { certificationInclude, findCertification, findCertifications, insertCertification, editCertification, lockCertification, detachCertificationImage, deleteCertificationRecord } from "./certification.repository.js";

export function serializeCertification<T extends { imagePath: string | null }>(record: T) {
  return { ...record, imageUrl: record.imagePath ? storage.getPublicUrl(record.imagePath) : null };
}
export const listCertifications = async (admin = false) => (await findCertifications(admin)).map(serializeCertification);
export async function getCertification(id: number, admin = false) {
  const record = await findCertification(id);
  if (!record || (record.deleting && !admin)) throw new AppError("Certification not found.", 404);
  return serializeCertification(record);
}
export const createCertification = async (...args: Parameters<typeof insertCertification>) => serializeCertification(await insertCertification(...args));
export const updateCertification = async (...args: Parameters<typeof editCertification>) => serializeCertification(await editCertification(...args));

export async function uploadCertificationImage(id: number, image: Awaited<ReturnType<typeof readImageUpload>>) {
  await getCertification(id);
  const { buffer, altText, order: _order, ...metadata } = image;
  const record = await uploadImage("certifications", id, buffer, async (tx, path) => {
    const current = await lockCertification(tx, id);
    if (current.imagePath) await queueDeletion(tx, current.imagePath);
    return tx.certification.update({
      where: { id }, data: { imagePath: path, imageAlt: altText, ...metadata }, include: certificationInclude,
    });
  });
  return { data: serializeCertification(record), warning: await cleanupWarning(`certifications/${id}/`) };
}

export async function removeCertificationImage(id: number) {
  const record = await detachCertificationImage(id);
  return { data: serializeCertification(record), warning: await cleanupWarning(`certifications/${id}/`) };
}

export async function deleteCertification(id: number) {
  await detachCertificationImage(id, true);
  const result = await flushStorageCleanup(`certifications/${id}/`);
  if (result.failed || result.due) throw new AppError("Deletion is pending. Retry deletion or storage cleanup.", 502);
  await deleteCertificationRecord(id);
}
