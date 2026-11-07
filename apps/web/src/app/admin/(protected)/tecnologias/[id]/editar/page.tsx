import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { TechnologyForm } from "../../novo/CreateTechnologyForm";
import { updateTechnologyAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar tecnologia",
};

type EditTechnologyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTechnologyPage({
  params,
}: EditTechnologyPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const technologyId = Number(id);

  if (!Number.isSafeInteger(technologyId)) {
    notFound();
  }

  const technologies = await listTechnologies();

  const technology = technologies.find(
    (item) => item.id === technologyId,
  );

  if (!technology) {
    notFound();
  }

  const action = updateTechnologyAction.bind(null, technology.id);

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/tecnologias" variant="secondary">Voltar</ButtonLink>} title={<>Editar tecnologia</>} description={<>As alterações também aparecerão nos projetos,
        experiências e experimentos vinculados a esta tecnologia.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Tecnologias", href: "/admin/tecnologias" }, { label: "Editar tecnologia" }]} />

      <TechnologyForm
        key={technology.id}
        initialTechnology={technology}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}