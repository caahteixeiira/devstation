import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

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
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/experimentos" variant="secondary">Voltar</ButtonLink>} title={<>Editar experimento</>} description={<>Atualize o objetivo, o resultado e os vínculos do experimento.
        As alterações aparecerão no Laboratório.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Experimentos", href: "/admin/experimentos" }, { label: "Editar experimento" }]} />

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