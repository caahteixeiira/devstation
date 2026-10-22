import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getProjectBySlug } from "@/services/projects.service";
import { listTechnologies } from "@/services/technologies.service";
import { ProjectForm } from "../../novo/CreateProjectForm";
import { updateProjectAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar projeto",
};

type EditProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  await requireAdmin();

  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const technologies = await listTechnologies();

  const action = updateProjectAction.bind(null, project.slug);

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/projetos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Editar projeto</h1>

      <p className="mt-4 leading-7 text-foreground-muted">
        Atualize os dados de {project.title}.
      </p>

      <ProjectForm
        key={project.id}
        technologies={technologies}
        initialProject={project}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}
