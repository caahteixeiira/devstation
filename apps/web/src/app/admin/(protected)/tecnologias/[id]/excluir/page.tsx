import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { deleteTechnologyAction } from "./actions";
import { DeleteTechnologyForm } from "./DeleteTechnologyForm";

export const metadata: Metadata = {
  title: "Excluir tecnologia",
};

type DeleteTechnologyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteTechnologyPage({
  params,
}: DeleteTechnologyPageProps) {
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

  const action = deleteTechnologyAction.bind(null, technology.id);

  return (
    <section className="admin-page max-w-4xl admin-delete-page">
      <AdminPageHeader actions={<ButtonLink href="/admin/tecnologias" variant="secondary">Cancelar exclusão</ButtonLink>} title={<>Excluir tecnologia</>} description={<>Você está prestes a excluir a tecnologia{" "}
        <strong className="text-foreground">
          {technology.name}
        </strong>
        , da categoria {technology.category}.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Tecnologias", href: "/admin/tecnologias" }, { label: "Excluir tecnologia" }]} />

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          A tecnologia será removida do cadastro e deixará de
          aparecer nos projetos, experiências e experimentos
          aos quais está vinculada.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          Os projetos, experiências e experimentos serão mantidos.
        </p>
      </div>

      <DeleteTechnologyForm action={action} />
    </section>
  );
}