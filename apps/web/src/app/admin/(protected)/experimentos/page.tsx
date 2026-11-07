import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listExperiments } from "@/services/experiments.service";
export const metadata: Metadata = {
  title: "Gerenciar experimentos",
};

export default async function AdminExperimentsPage() {
  await requireAdmin();

  const experiments = await listExperiments();

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Experimentos</>} description={<>Experimentos cadastrados no Laboratório do DevStation.</>} actions={<ButtonLink
        href="/admin/experimentos/novo"
      >
        Novo experimento
      </ButtonLink>} />

      {experiments.length === 0 ? (
        <EmptyState title="Nenhum experimento cadastrado." description="Use a ação de criação acima para adicionar o primeiro registro." />
      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Experimentos — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Experimento
                </th>
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
              {experiments.map((experiment) => (
                <tr
                  key={experiment.id}
                  className="border-t border-border"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium"
                  >
                    {experiment.title}
                  </th>

                  <td className="px-4 py-4 text-foreground-muted">
                    {experiment.project?.title ?? "Sem projeto vinculado"}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge kind="experiment" status={experiment.status} />
                  </td>

                  <td className="px-4 py-4 text-foreground-muted">
                    {experiment.technologies.length > 0
                      ? experiment.technologies
                        .map((technology) => technology.name)
                        .join(", ")
                      : "Nenhuma tecnologia vinculada"}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/experimentos/${experiment.id}/editar`}
                      aria-label={`Editar experimento ${experiment.title}`}
                      className="text-primary-strong hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/experimentos/${experiment.id}/excluir`}
                      aria-label={`Excluir experimento ${experiment.title}`}
                      className="ml-4 inline-block text-primary-strong hover:underline"
                    >
                      Excluir
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