import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { FolderIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechList } from "@/components/ui/TechList";
import { cx } from "@/lib/cx";
import { formatDate } from "@/lib/dates";
import type { Experiment } from "@/types/experiment";

type ExperimentCardProps = {
  experiment: Experiment;
};

const labelStyles =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-accent-strong";

/**
 * Resultado conforme o status: ideia sem resultado não mostra nada;
 * em andamento indica que ainda não foi registrado; concluído sem
 * resultado recebe nota neutra. Com resultado, mostra sempre.
 */
function ExperimentResult({ experiment }: { experiment: Experiment }) {
  if (experiment.result) {
    return (
      <div className="mt-4 rounded-control border border-accent/30 bg-accent/10 px-4 py-3">
        <p className={labelStyles}>Resultado</p>

        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground-muted">
          {experiment.result}
        </p>
      </div>
    );
  }

  if (experiment.status === "IN_PROGRESS") {
    return (
      <p className="mt-4 font-mono text-xs text-foreground-subtle">
        Resultado ainda não registrado
      </p>
    );
  }

  if (experiment.status === "COMPLETED") {
    return (
      <p className="mt-4 font-mono text-xs text-foreground-subtle">
        Sem resultado registrado
      </p>
    );
  }

  return null;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const headingId = `experiment-${experiment.id}-title`;

  return (
    <Card
      as="article"
      padding="sm"
      aria-labelledby={headingId}
      className={cx(
        "flex h-full flex-col sm:p-5",
        experiment.status === "IN_PROGRESS" && "border-accent/40",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge kind="experiment" status={experiment.status} />

        <time
          dateTime={experiment.createdAt}
          className="font-mono text-xs text-foreground-subtle"
        >
          {formatDate(experiment.createdAt)}
        </time>
      </div>

      <h3
        id={headingId}
        className="mt-3 text-lg font-semibold tracking-tight text-foreground"
      >
        {experiment.title}
      </h3>

      {experiment.project && (
        <Link
          href={`/projetos/${encodeURIComponent(experiment.project.slug)}`}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
        >
          <FolderIcon className="size-3.5" />
          {experiment.project.title}
        </Link>
      )}

      <div className="mt-4">
        <p className={labelStyles}>Objetivo</p>

        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground-muted">
          {experiment.objective}
        </p>
      </div>

      <ExperimentResult experiment={experiment} />

      {experiment.technologies.length > 0 && (
        <TechList
          technologies={experiment.technologies}
          className="mt-auto pt-4"
        />
      )}
    </Card>
  );
}

export function ExperimentCardSkeleton() {
  return (
    <Card padding="sm" className="space-y-3 sm:p-5" aria-hidden="true">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-6 w-1/2" />
    </Card>
  );
}
