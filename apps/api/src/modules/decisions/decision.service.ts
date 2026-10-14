import { AppError } from "../../errors/AppError.js";
import {
  createDecision,
  deleteDecision,
  findDecisionById,
  findDecisionProjectById,
  findDecisionsByProjectId,
  updateDecision,
} from "./decision.repository.js";
import type {
  CreateDecisionBody,
  UpdateDecisionBody,
} from "./decision.schema.js";

async function ensureProjectExists(projectId: number) {
  const project = await findDecisionProjectById(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }
}

async function ensureDecisionExists(id: number) {
  const decision = await findDecisionById(id);

  if (!decision) {
    throw new AppError("Decision not found.", 404);
  }

  return decision;
}

export async function listProjectDecisions(projectId: number) {
  await ensureProjectExists(projectId);

  return findDecisionsByProjectId(projectId);
}

export async function createNewDecision(
  projectId: number,
  data: CreateDecisionBody,
) {
  await ensureProjectExists(projectId);

  return createDecision(projectId, data);
}

export async function updateExistingDecision(
  id: number,
  data: UpdateDecisionBody,
) {
  await ensureDecisionExists(id);

  return updateDecision(id, data);
}

export async function deleteExistingDecision(id: number) {
  await ensureDecisionExists(id);

  return deleteDecision(id);
}
