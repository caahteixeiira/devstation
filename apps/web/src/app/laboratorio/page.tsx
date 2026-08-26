import { PageIntro } from "@/components/layout/PageIntro";
import { ExperimentCard } from "@/app/features/lab/ExperimentCard";
import { experiments } from "@/app/features/lab/experiments";

export default function LaboratorioPage() {
  return (
    <PageIntro
      eyebrow="Experimentação"
      title="Laboratório"
      description="Experimentos, provas de conceito e tecnologias que estou explorando na prática."
      accent="accent"
    >
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {experiments.map((experiment) => (
          <ExperimentCard
            key={experiment.id}
            experiment={experiment}
          />
        ))}
      </div>
    </PageIntro>
  );
}