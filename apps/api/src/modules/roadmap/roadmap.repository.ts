import { prisma } from "../../lib/prisma.js";
import type { CreateRoadmapBody, UpdateRoadmapBody } from "./roadmap.schema.js";

type CreateRoadmapData = CreateRoadmapBody & {
  completedAt: Date | null;
};

type UpdateRoadmapData = UpdateRoadmapBody & {
  completedAt: Date | null;
};

export async function findAllRoadmapItems() {
  return prisma.roadmapItem.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
}

export async function findRoadmapItemById(id: number) {
  return prisma.roadmapItem.findUnique({
    where: { id },
  });
}

export async function createRoadmapItem(data: CreateRoadmapData) {
  return prisma.roadmapItem.create({
    data,
  });
}

export async function updateRoadmapItem(id: number, data: UpdateRoadmapData) {
  return prisma.roadmapItem.update({
    where: { id },
    data,
  });
}

export async function deleteRoadmapItem(id: number) {
  return prisma.roadmapItem.delete({
    where: { id },
  });
}
