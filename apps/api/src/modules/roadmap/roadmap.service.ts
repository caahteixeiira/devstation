import { AppError } from "../../errors/AppError.js";
import {
  createRoadmapItem,
  deleteRoadmapItem,
  findAllRoadmapItems,
  findRoadmapItemById,
  updateRoadmapItem,
} from "./roadmap.repository.js";
import type { CreateRoadmapBody, UpdateRoadmapBody } from "./roadmap.schema.js";

export async function listRoadmapItems() {
  return findAllRoadmapItems();
}

export async function createNewRoadmapItem(data: CreateRoadmapBody) {
  const completedAt = data.status === "COMPLETED" ? new Date() : null;

  return createRoadmapItem({
    ...data,
    completedAt,
  });
}

export async function updateExistingRoadmapItem(
  id: number,
  data: UpdateRoadmapBody,
) {
  const item = await findRoadmapItemById(id);

  if (!item) {
    throw new AppError("Roadmap item not found.", 404);
  }

  const finalStatus = data.status ?? item.status;

  const completedAt =
    finalStatus === "COMPLETED" && item.completedAt === null
      ? new Date()
      : item.completedAt;

  return updateRoadmapItem(id, {
    ...data,
    completedAt,
  });
}

export async function deleteExistingRoadmapItem(id: number) {
  const item = await findRoadmapItemById(id);

  if (!item) {
    throw new AppError("Roadmap item not found.", 404);
  }

  return deleteRoadmapItem(id);
}
