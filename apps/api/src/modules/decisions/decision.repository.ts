import { prisma } from "../../lib/prisma.js";
import type {
  CreateDecisionBody,
  UpdateDecisionBody,
} from "./decision.schema.js";

export async function findDecisionProjectById(projectId: number) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
}

export async function findDecisionsByProjectId(projectId: number) {
  return prisma.decision.findMany({
    where: { projectId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
}

export async function findDecisionById(id: number) {
  return prisma.decision.findUnique({
    where: { id },
  });
}

export async function createDecision(
  projectId: number,
  data: CreateDecisionBody,
) {
  return prisma.decision.create({
    data: {
      ...data,
      project: {
        connect: { id: projectId },
      },
    },
  });
}

export async function updateDecision(id: number, data: UpdateDecisionBody) {
  return prisma.decision.update({
    where: { id },
    data,
  });
}

export async function deleteDecision(id: number) {
  return prisma.decision.delete({
    where: { id },
  });
}
