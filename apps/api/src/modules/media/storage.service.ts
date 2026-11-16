import { randomUUID } from "node:crypto";
import { storage } from "../../lib/supabase.js";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { countDeletions, isImageReferenced, pendingDeletions, recordDeletionFailure, reserveUpload } from "./storage.repository.js";

export async function flushStorageCleanup(prefix?: string) {
  const tasks = await pendingDeletions(prefix);
  let failed = 0;
  for (const task of tasks) {
    try {
      // Never delete a live image, even if a stale reservation survived a crash.
      await prisma.$transaction(async (tx) => {
        const locked = await tx.$queryRaw<{ id: number }[]>`SELECT id FROM "StorageCleanup" WHERE id = ${task.id} FOR UPDATE`;
        if (!locked.length) return;
        if (!await isImageReferenced(task.path, tx)) await storage.deleteImage(task.path);
        await tx.storageCleanup.delete({ where: { id: task.id } });
      }, { timeout: 25_000 });
    } catch {
      failed++;
      console.error("[storage] Cleanup pending", { cleanupId: task.id, path: task.path });
      await recordDeletionFailure(task.id);
    }
  }
  return { processed: tasks.length - failed, failed, remaining: await countDeletions(prefix), due: await countDeletions(prefix, true) };
}

/** Reserve cleanup before touching Storage; failed commits leave a durable task. */
export async function uploadImage<T>(
  scope: "certifications" | "projects", id: number, buffer: Buffer,
  persist: (tx: Prisma.TransactionClient, path: string) => Promise<T>,
) {
  const path = `${scope}/${id}/${randomUUID()}.webp`;
  await reserveUpload(path);
  try {
    await storage.uploadImage(path, buffer);
    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.$queryRaw<{ id: number }[]>`SELECT id FROM "StorageCleanup" WHERE path = ${path} FOR UPDATE`;
      if (!reservation.length) throw new Error("Upload reservation expired; retry the upload.");
      const data = await persist(tx, path);
      await tx.storageCleanup.delete({ where: { path } });
      return data;
    });
    return result;
  } catch (error) {
    // Keep the reservation even when the request timed out: the object may exist.
    console.error("[storage] Upload not committed; cleanup reserved", { path });
    throw error;
  }
}

export async function cleanupWarning(prefix: string) {
  try {
    const result = await flushStorageCleanup(prefix);
    return result.remaining ? "Dados salvos. A limpeza de imagens antigas está pendente; tente novamente no gerenciador." : undefined;
  } catch {
    console.error("[storage] Could not process cleanup queue", { prefix });
    return "Dados salvos. Não foi possível confirmar a limpeza de imagens antigas; tente novamente no gerenciador.";
  }
}
