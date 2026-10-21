import Link from "next/link";
import type { Experiment } from "@/types/experiment";

type ExperimentCardProps = {
  experiment: Experiment;
};

const statusLabels: Record<Experiment["status"], string> = {
  IDEA: "Ideia",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {experiment.project && (
            <Link
              href={`/projetos/${encodeURIComponent(experiment.project.slug)}`}
              className="font-mono text-sm text-primary-strong hover:underline"
            >
              {experiment.project.title}
            </Link>
          )}

          <h2 className="mt-2 text-xl font-semibold text-foreground">
            {experiment.title}
          </h2>
        </div>

        <span className="rounded-full bg-surface-muted px-3 py-1 text-sm text-foreground-muted">
          {statusLabels[experiment.status]}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-line leading-7 text-foreground-muted">
        {experiment.objective}
      </p>

      {experiment.technologies.length > 0 && (
        <ul
          aria-label="Tecnologias utilizadas"
          className="mt-5 flex flex-wrap gap-2"
        >
          {experiment.technologies.map((technology) => (
            <li
              key={technology.id}
              className="rounded-lg border border-border px-3 py-1 text-sm text-foreground"
            >
              {technology.name}
            </li>
          ))}
        </ul>
      )}

      {experiment.result && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-medium text-foreground">Resultado</h3>

          <p className="mt-2 whitespace-pre-line leading-7 text-foreground-muted">
            {experiment.result}
          </p>
        </div>
      )}
    </article>
  );
}
