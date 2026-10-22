import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjects } from "@/services/projects.service";
import type { ProjectSummary } from "@/types/project";

export const metadata: Metadata = {
  title: "Gerenciar projetos",
};

const statusLabels: Record<ProjectSummary["status"], string> = {
  PLANNED: "Planejado",
  IN_DEVELOPMENT: "Em desenvolvimento",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};

export default async function AdminProjectsPage() {
  await requireAdmin();

  const projects = await listProjects();

  return (
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Projetos</h1>

      <p className="mt-4 text-foreground-muted">
        Projetos cadastrados no DevStation.
      </p>

      <Link
        href="/admin/projetos/novo"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
      >
        Novo projeto
      </Link>
      {projects.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum projeto cadastrado.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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

                  <td className="px-4 py-4">{statusLabels[project.status]}</td>

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

<Link
  href="/admin/projetos/novo"
  className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
>
  Novo projeto
</Link>;
