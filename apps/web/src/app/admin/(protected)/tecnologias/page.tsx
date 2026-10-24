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
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Tecnologias
      </h1>

      <p className="mt-4 text-foreground-muted">
        Tecnologias cadastradas no DevStation.
      </p>

      <Link
        href="/admin/tecnologias/novo"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
      >
        Nova tecnologia
      </Link>

      {technologies.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhuma tecnologia cadastrada.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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