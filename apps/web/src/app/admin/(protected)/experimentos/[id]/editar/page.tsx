import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getExperimentById } from "@/services/experiments.service";
import { listProjects } from "@/services/projects.service";
import { listTechnologies } from "@/services/technologies.service";
import { ExperimentForm } from "../../novo/CreateExperimentForm";
import { updateExperimentAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar experimento",
};

type EditExperimentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExperimentPage({
  params,
}: EditExperimentPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const experimentId = Number(id);

  if (!Number.isSafeInteger(experimentId)) {
    notFound();
  }

  const experiment = await getExperimentById(experimentId);

  if (!experiment) {
    notFound();
  }

  const [projects, technologies] = await Promise.all([
    listProjects(),
    listTechnologies(),
  ]);

  const action = updateExperimentAction.bind(null, experiment.id);

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/experimentos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos experimentos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Editar experimento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Atualize o objetivo, o resultado e os vínculos do experimento.
        As alterações aparecerão no Laboratório.
      </p>

      <ExperimentForm
        key={experiment.id}
        projects={projects}
        technologies={technologies}
        initialExperiment={experiment}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}