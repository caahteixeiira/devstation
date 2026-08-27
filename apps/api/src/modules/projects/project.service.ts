import {
  findAllProjects,
  findProjectBySlug,
} from "./project.repository.js";

export async function listProjects() {
  return findAllProjects();
}

export async function getProjectBySlug(slug: string) {
  return findProjectBySlug(slug);
}