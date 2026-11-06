import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
} from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechList } from "@/components/ui/TechList";
import { cx } from "@/lib/cx";
import type { ProjectSummary } from "@/types/project";

type ProjectCardProps = {
  project: ProjectSummary;
};

/**
 * Link estendido: o link do título cobre o card inteiro via ::after.
 * GitHub e demonstração são âncoras independentes, irmãs do link principal
 * (nunca aninhadas), posicionadas acima da área estendida com z-index.
 * Ordem de Tab: título, GitHub, demonstração.
 */
const stretchedLinkStyles =
  "after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary-strong focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-background";

const secondaryLinkStyles =
  "relative z-10 flex size-10 items-center justify-center rounded-control text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none";

export function ProjectCard({ project }: ProjectCardProps) {
  const isArchived = project.status === "ARCHIVED";

  return (
    <Card
      as="article"
      tone={isArchived ? "muted" : "surface"}
      padding="sm"
      className={cx(
        "group relative flex h-full flex-col transition hover:-translate-y-0.5 hover:border-border-strong focus-within:border-border-strong motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5",
        isArchived && "opacity-80",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge kind="project" status={project.status} />

        <span className="font-mono text-xs text-foreground-subtle">
          {project.slug}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
        <Link
          href={`/projetos/${encodeURIComponent(project.slug)}`}
          className={cx(
            "transition-colors group-hover:text-primary-strong motion-reduce:transition-none",
            stretchedLinkStyles,
          )}
        >
          {project.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground-muted">
        {project.summary}
      </p>

      <TechList
        technologies={project.technologies}
        max={5}
        className="mt-4"
      />

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span
          aria-hidden="true"
          className="flex items-center gap-1 font-mono text-xs text-foreground-subtle transition-colors group-hover:text-primary-strong motion-reduce:transition-none"
        >
          Ler case study
          <ArrowRightIcon className="size-3.5" />
        </span>

        {(project.githubUrl || project.demoUrl) && (
          <div className="flex items-center gap-1">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver código de ${project.title} no GitHub`}
                className={secondaryLinkStyles}
              >
                <CodeIcon className="size-4" />
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Acessar demonstração de ${project.title}`}
                className={secondaryLinkStyles}
              >
                <ArrowUpRightIcon className="size-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card padding="sm" className="space-y-3 sm:p-5" aria-hidden="true">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-6 w-1/2" />
    </Card>
  );
}
