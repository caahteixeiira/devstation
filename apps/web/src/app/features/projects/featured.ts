import { siteConfig } from "@/config/site";
import type { ProjectSummary } from "@/types/project";

/**
 * Regras de apresentação compartilhadas entre Home e Projetos.
 * Não alteram dados nem contratos: só escolhem e ordenam o que a API devolve.
 */
const statusPriority: Record<ProjectSummary["status"], number> = {
  COMPLETED: 0,
  IN_DEVELOPMENT: 1,
  PLANNED: 2,
  ARCHIVED: 3,
};

/** Ordena por status (Concluído, Em desenvolvimento, Planejado, Arquivado), mantendo a ordem da API em empates. */
export function sortProjectsByStatus(
  projects: ProjectSummary[],
): ProjectSummary[] {
  return [...projects].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status],
  );
}

/**
 * Projeto em destaque: o slug configurado em `siteConfig`, se existir na
 * listagem pública; senão, o primeiro não arquivado por prioridade de status.
 */
export function selectFeaturedProject(
  projects: ProjectSummary[],
): ProjectSummary | null {
  const configuredSlug = siteConfig.featuredProjectSlug;

  if (configuredSlug) {
    const configured = projects.find(
      (project) => project.slug === configuredSlug,
    );

    if (configured) {
      return configured;
    }
  }

  const candidates = projects.filter(
    (project) => project.status !== "ARCHIVED",
  );

  return candidates.length > 0 ? sortProjectsByStatus(candidates)[0] : null;
}
