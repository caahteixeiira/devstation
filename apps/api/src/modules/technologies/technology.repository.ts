import { prisma } from "../../lib/prisma.js";
import type { CreateTechnologyBody, UpdateTechnologyBody } from "./technology.schema.js";

export async function findAllTechnologies() {
  return prisma.technology.findMany({
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function technologyExistsByName(name: string) {
  return prisma.technology.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });
}

export async function createTechnology(data: CreateTechnologyBody) {
  return prisma.technology.create({
    data,
  });
}

export async function technologyExistsById(id: number) {
  return prisma.technology.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

export async function updateTechnology(
  id: number,
  data: UpdateTechnologyBody,
) {
  return prisma.technology.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTechnologyById(id: number){
  return prisma.technology.delete({
    where: {
      id
    }
  })
}