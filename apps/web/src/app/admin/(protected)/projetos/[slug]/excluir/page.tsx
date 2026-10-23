import type { Metadata } from "next";
import Link from "next/link";
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
    <section className="max-w-3xl">
      <Link
        href="/admin/projetos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Excluir projeto
      </h1>

      <p className="mt-4 text-foreground-muted">
        Você está prestes a excluir o projeto{" "}
        <strong className="text-foreground">
          {project.title}
        </strong>.
      </p>

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