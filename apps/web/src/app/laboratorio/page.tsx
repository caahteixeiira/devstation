import { PageIntro } from "@/components/layout/PageIntro";
import { ExperimentCard } from "@/app/features/lab/ExperimentCard";
import { listExperiments } from "@/services/experiments.service";

export default async function LaboratorioPage() {
  const experiments = await listExperiments();

  return (
    <PageIntro
      eyebrow="Experimentação"
      title="Laboratório"
      description="Experimentos, provas de conceito e tecnologias que estou explorando na prática."
      accent="accent"
    >
      {experiments.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum experimento disponível no momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </PageIntro>
  );
}
