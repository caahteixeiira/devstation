import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { FolderIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  FeaturedProjectCard,
  FeaturedProjectCardSkeleton,
} from "@/app/features/projects/FeaturedProjectCard";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/app/features/projects/ProjectCard";
import {
  selectFeaturedProject,
  sortProjectsByStatus,
} from "@/app/features/projects/featured";
import { projectsPageIntro } from "@/app/features/projects/intro";
import { ApiError } from "@/lib/api/client";
import { countLabel } from "@/lib/text";
import { getProjectBySlug, listProjects } from "@/services/projects.service";
import type { ProjectSummary } from "@/types/project";

export const metadata: Metadata = {
  title: projectsPageIntro.title,
  description: projectsPageIntro.description,
};

/**
 * Detalhe do destaque. Falha de API degrada para o resumo e fica no log;
 * outros erros sobem.
 */
async function FeaturedSection({ project }: { project: ProjectSummary }) {
  let detail = null;

  try {
    detail = await getProjectBySlug(project.slug);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    console.error("[projects] Failed to load featured project detail.", error);
  }

  return (
    <FeaturedProjectCard
      summary={project}
      detail={detail}
      headingId="featured-project-title"
      className="mt-4"
    />
  );
}

/**
 * Conteúdo dependente da API, em Suspense interno: a listagem mantém o
 * skeleton sem um loading.tsx de rota, que faria o detalhe responder 200
 * para slugs inexistentes.
 */
async function ProjectsContent() {
  await connection();
  const projects = await listProjects();

  const featured = selectFeaturedProject(projects);
  const others = sortProjectsByStatus(
    projects.filter((project) => project.id !== featured?.id),
  );

  return (
    <PageIntro
      {...projectsPageIntro}
      meta={
        projects.length > 0 ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {countLabel(projects.length, "projeto")}
          </span>
        ) : undefined
      }
    >
      {projects.length === 0 ? (
        <EmptyState
          className="mt-12"
          icon={<FolderIcon />}
          title="Nenhum projeto disponível ainda."
          description="Os case studies aparecem aqui assim que forem cadastrados."
        />
      ) : (
        <>
          {featured && (
            <section
              aria-labelledby="featured-project-title"
              className="mt-12"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
                Case study em destaque
              </p>

              <Suspense
                fallback={<FeaturedProjectCardSkeleton className="mt-4" />}
              >
                <FeaturedSection project={featured} />
              </Suspense>
            </section>
          )}

          {others.length > 0 && (
            <section aria-labelledby="all-projects-title" className="mt-16">
              <SectionHeader
                id="all-projects-title"
                eyebrow="Coleção"
                title="Todos os case studies"
                description="Cada projeto documenta o problema, a solução, a arquitetura e as decisões técnicas tomadas no caminho."
              />

              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {others.map((project) => (
                  <li key={project.id}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </PageIntro>
  );
}

function ProjectsSkeleton() {
  return (
    <PageIntro {...projectsPageIntro}>
      <p role="status" className="sr-only">
        Carregando projetos…
      </p>

      <div className="mt-12">
        <Skeleton className="h-4 w-48" />
        <FeaturedProjectCardSkeleton className="mt-4" />
      </div>

      <div className="mt-16">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-64" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </PageIntro>
  );
}

export default function ProjetosPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
}
