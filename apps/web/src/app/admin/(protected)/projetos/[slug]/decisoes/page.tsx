import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjectDecisions } from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";

export const metadata: Metadata = {
  title: "Decisões técnicas",
};

type ProjectDecisionsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDecisionsPage({
  params,
}: ProjectDecisionsPageProps) {
  await requireAdmin();

  const { slug } = await params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    notFound();
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const decisions = await listProjectDecisions(project.id);

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/projetos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Decisões técnicas</h1>

      <p className="mt-4 text-foreground-muted">
        Projeto: <strong className="text-foreground">{project.title}</strong>
      </p>

      <Link
        href={`/admin/projetos/${encodeURIComponent(project.slug)}/decisoes/novo`}
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground hover:bg-primary-strong"
      >
        Nova decisão técnica
      </Link>

      {decisions.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhuma decisão técnica cadastrada para este projeto.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {decisions.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="font-medium">Contexto</dt>
                  <dd className="mt-1 whitespace-pre-line text-foreground-muted">
                    {item.context}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Decisão</dt>
                  <dd className="mt-1 whitespace-pre-line text-foreground-muted">
                    {item.decision}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Consequências</dt>
                  <dd className="mt-1 whitespace-pre-line text-foreground-muted">
                    {item.consequences}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/admin/projetos/${encodeURIComponent(project.slug)}/decisoes/${item.id}/editar`}
                aria-label={`Editar decisão ${item.title}`}
                className="mt-4 inline-block text-primary-strong hover:underline"
              >
                Editar
              </Link>

              <Link
                href={`/admin/projetos/${encodeURIComponent(project.slug)}/decisoes/${item.id}/excluir`}
                aria-label={`Excluir decisão ${item.title}`}
                className="ml-4 inline-block text-primary-strong hover:underline"
              >
                Excluir
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
