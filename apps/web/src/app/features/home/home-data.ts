import { cache } from "react";
import { loadSection } from "@/lib/section-data";
import { listArticles } from "@/services/articles.service";
import { listExperiences } from "@/services/experiences.service";
import { listProjects } from "@/services/projects.service";
import type { ProjectSummary } from "@/types/project";

/**
 * Carregamento de dados da Home.
 *
 * Um loader por domínio, cada um memoizado com `cache()` do React: dentro de
 * uma mesma requisição, seções diferentes que precisam da mesma listagem
 * compartilham uma única chamada, mas cada seção só aguarda o que usa.
 *
 * Falhas de API (`ApiError`) são registradas e viram `{ ok: false }`, para a
 * seção degradar sem derrubar a página. Qualquer outro erro é relançado.
 */
export const getHomeProjects = cache(() => loadSection("home", "projects", listProjects));
export const getHomeArticles = cache(() => loadSection("home", "articles", listArticles));
export const getHomeExperiences = cache(() =>
  loadSection("home", "experiences", listExperiences),
);

/** Tecnologias mais frequentes entre os projetos, por nome. */
export function topTechnologies(
  projects: ProjectSummary[],
  limit: number,
): string[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    for (const technology of project.technologies) {
      counts.set(technology.name, (counts.get(technology.name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}
