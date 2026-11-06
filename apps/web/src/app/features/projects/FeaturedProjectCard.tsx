import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
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
import { countLabel } from "@/lib/text";
import type { ProjectDetail, ProjectSummary } from "@/types/project";

type FeaturedProjectCardProps = {
  summary: ProjectSummary;
  /** Detalhe do projeto; `null` quando a chamada falhou ou ainda não existe. */
  detail: ProjectDetail | null;
  headingId: string;
  className?: string;
};

function ProjectPlaceholder({ project }: { project: ProjectSummary }) {
  return (
    <div className="relative flex h-full min-h-64 flex-col justify-between overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-border-strong)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40"
      />

      <p className="relative font-mono text-xs text-foreground-subtle">
        {"// "}
        {project.slug}
      </p>

      <div className="relative">
        <p className="font-mono text-2xl font-semibold text-foreground-subtle">
          &gt;_
        </p>

        <TechList technologies={project.technologies} className="mt-4" />
      </div>
    </div>
  );
}

/**
 * Card largo do case study em destaque, usado na Home e em Projetos.
 * Com `detail`, mostra imagem, trecho do problema e contagens; sem ele,
 * degrada para o resumo.
 */
export function FeaturedProjectCard({
  summary,
  detail,
  headingId,
  className,
}: FeaturedProjectCardProps) {
  const image = detail?.images[0] ?? null;
  const metaParts = detail
    ? [
        countLabel(
          detail.decisions.length,
          "decisão técnica",
          "decisões técnicas",
        ),
        countLabel(detail.features.length, "funcionalidade"),
      ]
    : [];

  return (
    <Card padding="none" className={cx("overflow-hidden", className)}>
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge kind="project" status={summary.status} />

            <span className="font-mono text-xs text-foreground-subtle">
              {summary.slug}
            </span>
          </div>

          <h2
            id={headingId}
            className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {summary.title}
          </h2>

          <p className="mt-3 leading-7 text-foreground-muted">
            {summary.summary}
          </p>

          {detail && (
            <div className="mt-5 rounded-control border-l-2 border-primary-strong bg-surface-muted px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
                Problema
              </p>

              <p className="mt-1 line-clamp-4 text-sm leading-6 text-foreground-muted">
                {detail.problem}
              </p>
            </div>
          )}

          {metaParts.length > 0 && (
            <p className="mt-5 font-mono text-xs text-foreground-subtle">
              {metaParts.join(" · ")}
            </p>
          )}

          <TechList technologies={summary.technologies} className="mt-5" />

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <ButtonLink href={`/projetos/${encodeURIComponent(summary.slug)}`}>
              Ler case study
              <ArrowRightIcon className="size-4" />
            </ButtonLink>

            {summary.githubUrl && (
              <ButtonLink href={summary.githubUrl} external variant="secondary">
                <CodeIcon className="size-4" />
                Código
              </ButtonLink>
            )}

            {summary.demoUrl && (
              <ButtonLink href={summary.demoUrl} external variant="secondary">
                Demonstração
                <ArrowUpRightIcon className="size-4" />
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="relative order-first border-b border-border bg-surface-muted lg:order-none lg:border-b-0 lg:border-l">
          {image ? (
            <div className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <Image
                src={image.imageUrl}
                alt={image.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          ) : (
            <ProjectPlaceholder project={summary} />
          )}
        </div>
      </div>
    </Card>
  );
}

export function FeaturedProjectCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card
      padding="none"
      className={cx("overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="grid lg:grid-cols-2">
        <div className="space-y-4 p-6 sm:p-8">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-40" />
        </div>

        <Skeleton className="order-first min-h-64 rounded-none lg:order-none" />
      </div>
    </Card>
  );
}
