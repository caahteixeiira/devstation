import type { Metadata } from "next";
import Link from "next/link";
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
    <section className="max-w-2xl">
      <Link
        href="/admin/tecnologias"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às tecnologias
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Editar tecnologia
      </h1>

      <p className="mt-4 text-foreground-muted">
        As alterações também aparecerão nos projetos,
        experiências e experimentos vinculados a esta tecnologia.
      </p>

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