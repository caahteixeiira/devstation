import { findAllProjects } from "./project.repository.js";

export async function listProjects() {
  return findAllProjects();
}