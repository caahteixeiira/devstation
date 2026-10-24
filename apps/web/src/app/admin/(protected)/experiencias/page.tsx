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
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Experiências
      </h1>

      <p className="mt-4 text-foreground-muted">
        Experiências profissionais cadastradas no DevStation.
      </p>

      <Link
        href="/admin/experiencias/novo"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
      >
        Nova experiência
      </Link>
      <Link
  href="/admin/experiencias"
  className="mt-8 inline-flex rounded-lg border border-border bg-surface px-5 py-3 font-medium transition hover:border-primary-strong"
>
  Gerenciar experiências →
</Link>

      {experiences.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhuma experiência cadastrada.
        </p>

      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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