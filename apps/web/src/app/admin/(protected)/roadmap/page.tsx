import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listRoadmapItems } from "@/services/roadmap.service";
export const metadata: Metadata = {
  title: "Gerenciar planejamento",
};

export default async function AdminRoadmapPage() {
  await requireAdmin();

  const items = await listRoadmapItems();

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Planejamento</>} description={<>Etapas planejadas, em andamento e concluídas do DevStation.</>} actions={<ButtonLink
        href="/admin/roadmap/novo"
      >
        Novo item
      </ButtonLink>} />

      {items.length === 0 ? (
        <EmptyState title="Nenhum item de planejamento cadastrado." description="Use a ação de criação acima para adicionar o primeiro registro." />
      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Planejamento — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Ordem
                </th>

                <th scope="col" className="px-4 py-3">
                  Item
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border"
                >
                  <td className="px-4 py-4">
                    {item.order}
                  </td>

                  <th
                    scope="row"
                    className="px-4 py-4 font-medium"
                  >
                    <span className="block">
                      {item.title}
                    </span>

                    <span className="mt-1 block font-normal text-foreground-muted">
                      {item.description}
                    </span>
                  </th>

                  <td className="px-4 py-4">
                    <StatusBadge kind="roadmap" status={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/roadmap/${item.id}/editar`}
                      aria-label={`Editar item ${item.title}`}
                      className="text-primary-strong hover:underline"
                    >
                      Editar
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