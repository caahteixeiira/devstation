import { number } from "zod";
import { AppError } from "../../errors/AppError.js";
import {
  createTechnology,
  findAllTechnologies,
  technologyExistsByName,
  technologyExistsById,
  updateTechnology,
  deleteTechnologyById
} from "./technology.repository.js";
import type { CreateTechnologyBody, UpdateTechnologyBody } from "./technology.schema.js";

export async function listTechnologies() {
  return findAllTechnologies();
}

export async function createNewTechnology(data: CreateTechnologyBody) {
  const technologyAlreadyExists = await technologyExistsByName(data.name);

  if (technologyAlreadyExists) {
    throw new AppError("Technology already exists.", 409);
  }

  return createTechnology(data);
}


export async function updateExistingTechnology(id: number,data: UpdateTechnologyBody,) {
  const technologyExists = await technologyExistsById(id);

  if (!technologyExists) {
    throw new AppError("Technology not found.", 404);
  }

  if (data.name !== undefined) {
    const technologyWithSameName =
      await technologyExistsByName(data.name);

    if (
      technologyWithSameName &&
      technologyWithSameName.id !== id
    ) {
      throw new AppError("Technology already exists.", 409);
    }
  }

  return updateTechnology(id, data);
}

export async function deleteExistingTechnology(id: number) {
  const technologyExists = await technologyExistsById(id);

  if (!technologyExists) {
    throw new AppError("Technology not found.", 404);
  }

  return deleteTechnologyById(id);
}