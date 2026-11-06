import type { Metadata } from "next";
import { connection } from "next/server";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlaskIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperimentCard } from "@/app/features/lab/ExperimentCard";
import { labPageIntro } from "@/app/features/lab/intro";
import { countLabel } from "@/lib/text";
import { listExperiments } from "@/services/experiments.service";
import type { Experiment } from "@/types/experiment";

type Group = {
  status: Experiment["status"];
  id: string;
  title: string;
  description: string;
};

/** Ordem de leitura: o que está sendo testado agora, depois ideias, depois o que já fechou. */
const groups: Group[] = [
  {
    status: "IN_PROGRESS",
    id: "lab-in-progress",
    title: "Em andamento",
    description: "Experimentos em execução, com resultado ainda em aberto.",
  },
  {
    status: "IDEA",
    id: "lab-ideas",
    title: "Ideias",
    description: "Hipóteses anotadas para testar quando fizer sentido.",
  },
  {
    status: "COMPLETED",
    id: "lab-completed",
    title: "Concluídos",
    description: "Experimentos encerrados, com o que foi observado.",
  },
];

export const metadata: Metadata = {
  title: "Laboratório",
  description: "Experimentos, hipóteses e aprendizados em exploração, com tecnologias testadas e resultados.",
};

export default async function LaboratorioPage() {
  await connection();
  const experiments = await listExperiments();

  const byStatus = groups
    .map((group) => ({
      ...group,
      items: experiments
        .filter((experiment) => experiment.status === group.status)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <PageIntro
      {...labPageIntro}
      meta={
        experiments.length > 0 ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {countLabel(experiments.length, "experimento")}
          </span>
        ) : undefined
      }
    >
      {experiments.length === 0 ? (
        <EmptyState
          className="mt-12"
          icon={<FlaskIcon />}
          title="Nenhum experimento disponível ainda."
          description="As entradas do laboratório aparecem aqui assim que forem registradas."
        />
      ) : (
        <div className="mt-12 space-y-16">
          {byStatus.map((group) => (
            <section key={group.id} aria-labelledby={`${group.id}-title`}>
              <SectionHeader
                id={`${group.id}-title`}
                tone="accent"
                eyebrow={countLabel(group.items.length, "experimento")}
                title={group.title}
                description={group.description}
              />

              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {group.items.map((experiment) => (
                  <li key={experiment.id}>
                    <ExperimentCard experiment={experiment} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageIntro>
  );
}
