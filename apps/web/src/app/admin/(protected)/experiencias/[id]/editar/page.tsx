import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listExperiences } from "@/services/experiences.service";
import { listTechnologies } from "@/services/technologies.service";
import { ExperienceForm } from "../../novo/CreateExperienceForm";
import { updateExperienceAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar experiência",
};

type EditExperiencePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
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

  const technologies = await listTechnologies();
  const action = updateExperienceAction.bind(null, experience.id);

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/experiencias" variant="secondary">Voltar</ButtonLink>} title={<>Editar experiência</>} description={<>Atualize sua experiência em {experience.company}.
        As alterações aparecerão na página Sobre.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Experiências", href: "/admin/experiencias" }, { label: "Editar experiência" }]} />

      <ExperienceForm
        key={experience.id}
        technologies={technologies}
        initialExperience={experience}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}