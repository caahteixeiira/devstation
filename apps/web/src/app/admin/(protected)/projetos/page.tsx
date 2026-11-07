import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjects } from "@/services/projects.service";
export const metadata: Metadata = {
  title: "Gerenciar projetos",
};

export default async function AdminProjectsPage() {
  await requireAdmin();

  const projects = await listProjects();

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Projetos</>} description={<>Projetos cadastrados no DevStation.</>} actions={<ButtonLink
        href="/admin/projetos/novo"
      >
        Novo projeto
      </ButtonLink>} />
      {projects.length === 0 ? (
        <EmptyState title="Nenhum projeto cadastrado." description="Use a ação de criação acima para adicionar o primeiro registro." />
      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Projetos — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Projeto
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Tecnologias
                </th>
                <th scope="col" className="px-4 py-3">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-border">
                  <th scope="row" className="px-4 py-4 font-medium">
                    <span className="block">{project.title}</span>

                    <span className="mt-1 block font-normal text-foreground-muted">
                      {project.slug}
                    </span>
                  </th>

                  <td className="px-4 py-4"><StatusBadge kind="project" status={project.status} /></td>

                  <td className="px-4 py-4 text-foreground-muted">
                    {project.technologies.length > 0
                      ? project.technologies
                        .map((technology) => technology.name)
                        .join(", ")
                      : "Nenhuma tecnologia vinculada"}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/projetos/${encodeURIComponent(project.slug)}/editar`}
                      className="mr-4 inline-block text-primary-strong hover:underline"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/admin/projetos/${encodeURIComponent(project.slug)}/excluir`}
                      aria-label={`Excluir projeto ${project.title}`}
                      className="mr-4 inline-block text-primary-strong hover:underline"
                    >
                      Excluir
                    </Link>

                    <Link
                      href={`/admin/projetos/${encodeURIComponent(project.slug)}/decisoes`}
                      aria-label={`Ver decisões técnicas de ${project.title}`}
                      className="ml-4 inline-block text-primary-strong hover:underline"
                    >
                      Decisões técnicas
                    </Link>

                    <Link
                      href={`/projetos/${encodeURIComponent(project.slug)}`}
                      aria-label={`Ver projeto ${project.title}`}
                      className="text-primary-strong hover:underline"
                    >
                      Ver no portfólio →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
