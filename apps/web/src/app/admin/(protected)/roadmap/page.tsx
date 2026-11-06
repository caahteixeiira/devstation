import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listRoadmapItems } from "@/services/roadmap.service";
import type { RoadmapItem } from "@/types/roadmap";

export const metadata: Metadata = {
  title: "Gerenciar planejamento",
};

const statusLabels: Record<RoadmapItem["status"], string> = {
  NOW: "Agora",
  NEXT: "Próximo",
  FUTURE: "Futuro",
  COMPLETED: "Concluído",
};

export default async function AdminRoadmapPage() {
  await requireAdmin();

  const items = await listRoadmapItems();

  return (
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Planejamento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Etapas planejadas, em andamento e concluídas do DevStation.
      </p>

      <Link
        href="/admin/roadmap/novo"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-strong"
      >
        Novo item
      </Link>

      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum item de planejamento cadastrado.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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
                    {statusLabels[item.status]}
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