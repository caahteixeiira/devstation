import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getProjectBySlug } from "@/services/projects.service";
import { deleteProjectAction } from "./actions";
import { DeleteProjectForm } from "./DeleteProjectForm";

export const metadata: Metadata = {
  title: "Excluir projeto",
};

type DeleteProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DeleteProjectPage({
  params,
}: DeleteProjectPageProps) {
  await requireAdmin();

  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const action = deleteProjectAction.bind(null, project.slug);

  return (
    <section className="admin-page max-w-4xl admin-delete-page">
      <AdminPageHeader actions={<ButtonLink href="/admin/projetos" variant="secondary">Cancelar exclusão</ButtonLink>} title={<>Excluir projeto</>} description={<>Você está prestes a excluir o projeto{" "}
        <strong className="text-foreground">
          {project.title}
        </strong>.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Projetos", href: "/admin/projetos" }, { label: "Excluir projeto" }]} />

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          O que será removido
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          O projeto, suas funcionalidades, melhorias, registros de
          imagens, decisões técnicas e artigos vinculados serão
          excluídos definitivamente.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          Os experimentos serão mantidos e perderão o vínculo com
          este projeto. As tecnologias e os arquivos de imagens
          em public também serão mantidos.
        </p>
      </div>

      <DeleteProjectForm
        slug={project.slug}
        action={action}
      />
    </section>
  );
}