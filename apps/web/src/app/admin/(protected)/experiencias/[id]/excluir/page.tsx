import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listExperiences } from "@/services/experiences.service";
import { deleteExperienceAction } from "./actions";
import { DeleteExperienceForm } from "./DeleteExperienceForm";

export const metadata: Metadata = {
  title: "Excluir experiência",
};

type DeleteExperiencePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteExperiencePage({
  params,
}: DeleteExperiencePageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const experienceId = Number(id);

  if (!Number.isSafeInteger(experienceId)) {
    notFound();
  }

  const experiences = await listExperiences();

  const experience = experiences.find(
    (item) => item.id === experienceId,
  );

  if (!experience) {
    notFound();
  }

  const action = deleteExperienceAction.bind(null, experience.id);

  return (
    <section className="admin-page max-w-4xl admin-delete-page">
      <AdminPageHeader actions={<ButtonLink href="/admin/experiencias" variant="secondary">Cancelar exclusão</ButtonLink>} title={<>Excluir experiência</>} description={<>Você está prestes a excluir sua experiência como{" "}
        <strong className="text-foreground">
          {experience.role}
        </strong>{" "}
        em{" "}
        <strong className="text-foreground">
          {experience.company}
        </strong>.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Experiências", href: "/admin/experiencias" }, { label: "Excluir experiência" }]} />

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          A experiência, suas responsabilidades e conquistas
          serão removidas definitivamente e deixarão de aparecer
          na página Sobre.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          As tecnologias vinculadas permanecerão cadastradas.
        </p>
      </div>

      <DeleteExperienceForm action={action} />
    </section>
  );
}