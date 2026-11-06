import { cache } from "react";
import { siteConfig } from "@/config/site";
import { loadSection, type Loaded } from "@/lib/section-data";
import { listArticles } from "@/services/articles.service";
import { getProjectBySlug } from "@/services/projects.service";
import { listRoadmapItems } from "@/services/roadmap.service";
import type { ProjectDetail } from "@/types/project";

/**
 * Dados da página Engenharia: um loader por domínio, memoizado por
 * requisição com `cache()`. Cada seção aguarda só o que usa.
 */
const SCOPE = "engineering";

/** Projeto que representa o próprio DevStation. `data: null` quando não há slug configurado ou a API não o conhece. */
export const getEngineeringProject = cache(
  async (): Promise<Loaded<ProjectDetail | null>> => {
    const slug = siteConfig.engineeringProjectSlug;

    if (!slug) {
      return { ok: true, data: null };
    }

    return loadSection(SCOPE, "engineering project", () =>
      getProjectBySlug(slug),
    );
  },
);

export const getEngineeringRoadmap = cache(() =>
  loadSection(SCOPE, "roadmap", listRoadmapItems),
);

export const getEngineeringArticles = cache(() =>
  loadSection(SCOPE, "articles", listArticles),
);
