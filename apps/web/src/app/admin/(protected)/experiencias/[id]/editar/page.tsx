import type { Metadata } from "next";
import Link from "next/link";
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
    <section className="max-w-3xl">
      <Link
        href="/admin/experiencias"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às experiências
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Editar experiência
      </h1>

      <p className="mt-4 text-foreground-muted">
        Atualize sua experiência em {experience.company}.
        As alterações aparecerão na página Sobre.
      </p>

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