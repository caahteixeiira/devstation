import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listExperiences } from "@/services/experiences.service";

export const metadata: Metadata = {
  title: "Gerenciar experiências",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export default async function AdminExperiencesPage() {
  await requireAdmin();

  const experiences = await listExperiences();

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Experiências</>} description={<>Experiências profissionais cadastradas no DevStation.</>} actions={<ButtonLink
        href="/admin/experiencias/novo"
      >
        Nova experiência
      </ButtonLink>} />

      {experiences.length === 0 ? (
        <EmptyState title="Nenhuma experiência cadastrada." description="Use a ação de criação acima para adicionar o primeiro registro." />

      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Experiências — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Empresa e cargo
                </th>

                <th scope="col" className="px-4 py-3">
                  Período
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
              {experiences.map((experience) => (
                <tr
                  key={experience.id}
                  className="border-t border-border"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium"
                  >
                    <span className="block">
                      {experience.company}
                    </span>

                    <span className="mt-1 block font-normal text-foreground-muted">
                      {experience.role}
                    </span>
                  </th>

                  <td className="px-4 py-4">
                    {formatDate(experience.startDate)}
                    {" — "}
                    {experience.current
                      ? "Atual"
                      : experience.endDate
                        ? formatDate(experience.endDate)
                        : "Término não informado"}
                  </td>

                  <td className="px-4 py-4 text-foreground-muted">
                    {experience.technologies.length > 0
                      ? experience.technologies
                        .map((technology) => technology.name)
                        .join(", ")
                      : "Nenhuma tecnologia vinculada"}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/experiencias/${experience.id}/editar`}
                      aria-label={`Editar experiência em ${experience.company}`}
                      className="text-primary-strong hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/experiencias/${experience.id}/excluir`}
                      aria-label={`Excluir experiência em ${experience.company}`}
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