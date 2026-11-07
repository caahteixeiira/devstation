import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";

export const metadata: Metadata = {
  title: "Gerenciar tecnologias",
};

export default async function AdminTechnologiesPage() {
  await requireAdmin();

  const technologies = await listTechnologies();

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Tecnologias</>} description={<>Tecnologias cadastradas no DevStation.</>} actions={<ButtonLink
        href="/admin/tecnologias/novo"
      >
        Nova tecnologia
      </ButtonLink>} />

      {technologies.length === 0 ? (
        <EmptyState title="Nenhuma tecnologia cadastrada." description="Use a ação de criação acima para adicionar o primeiro registro." />
      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Tecnologias — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Nome
                </th>
                <th scope="col" className="px-4 py-3">
                  Categoria
                </th>
                <th scope="col" className="px-4 py-3">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {technologies.map((technology) => (
                <tr
                  key={technology.id}
                  className="border-t border-border"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium"
                  >
                    {technology.name}
                  </th>

                  <td className="px-4 py-4 text-foreground-muted">
                    {technology.category}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/tecnologias/${technology.id}/editar`}
                      aria-label={`Editar tecnologia ${technology.name}`}
                      className="text-primary-strong hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/tecnologias/${technology.id}/excluir`}
                      aria-label={`Excluir tecnologia ${technology.name}`}
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