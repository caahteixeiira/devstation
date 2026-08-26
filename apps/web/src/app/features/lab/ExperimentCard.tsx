import type {
  Experiment,
  ExperimentStatus,
} from "./experiments";

type ExperimentCardProps = {
  experiment: Experiment;
};

const statusLabels: Record<ExperimentStatus, string> = {
  idea: "Ideia",
  "in-progress": "Em andamento",
  completed: "Concluído",
};

export function ExperimentCard({
  experiment,
}: ExperimentCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {experiment.project && (
            <p className="font-mono text-sm text-primary-strong">
              {experiment.project}
            </p>
          )}

          <h2 className="mt-2 text-xl font-semibold text-foreground">
            {experiment.title}
          </h2>
        </div>

        <span className="rounded-full bg-surface-muted px-3 py-1 text-sm text-foreground-muted">
          {statusLabels[experiment.status]}
        </span>
      </div>

      <p className="mt-4 leading-7 text-foreground-muted">
        {experiment.objective}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {experiment.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-lg border border-border px-3 py-1 text-sm text-foreground"
          >
            {technology}
          </span>
        ))}
      </div>

      {experiment.result && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-sm font-medium text-foreground">
            Resultado
          </p>

          <p className="mt-2 leading-7 text-foreground-muted">
            {experiment.result}
          </p>
        </div>
      )}
    </article>
  );
}