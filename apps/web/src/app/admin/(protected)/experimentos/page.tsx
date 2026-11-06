import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listExperiments } from "@/services/experiments.service";
import type { Experiment } from "@/types/experiment";


export const metadata: Metadata = {
  title: "Gerenciar experimentos",
};

const statusLabels: Record<Experiment["status"], string> = {
  IDEA: "Ideia",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

export default async function AdminExperimentsPage() {
  await requireAdmin();

  const experiments = await listExperiments();

  return (
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Experimentos
      </h1>

      <p className="mt-4 text-foreground-muted">
        Experimentos cadastrados no Laboratório do DevStation.
      </p>

      <Link
        href="/admin/experimentos/novo"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-strong"
      >
        Novo experimento
      </Link>

      {experiments.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum experimento cadastrado.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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
                    {statusLabels[experiment.status]}
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
</td>
<Link
  href={`/admin/experimentos/${experiment.id}/excluir`}
  aria-label={`Excluir experimento ${experiment.title}`}
  className="ml-4 inline-block text-primary-strong hover:underline"
>
  Excluir
</Link>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}