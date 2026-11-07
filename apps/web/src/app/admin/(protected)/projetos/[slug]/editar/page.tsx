import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

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
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/projetos" variant="secondary">Voltar</ButtonLink>} title={<>Editar projeto</>} description={<>Atualize os dados de {project.title}.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Projetos", href: "/admin/projetos" }, { label: "Editar projeto" }]} />

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
