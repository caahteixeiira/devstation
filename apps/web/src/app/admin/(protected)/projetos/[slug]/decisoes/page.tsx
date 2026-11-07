import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
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
    <section className="admin-page max-w-4xl">
      <AdminPageHeader title={<>Decisões técnicas</>} description={<>Projeto: <strong className="text-foreground">{project.title}</strong></>} actions={<ButtonLink
        href={`/admin/projetos/${encodeURIComponent(project.slug)}/decisoes/novo`}
      >
        Nova decisão técnica
      </ButtonLink>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Projetos", href: "/admin/projetos" }, { label: "Decisões técnicas" }]} />

      {decisions.length === 0 ? (
        <EmptyState title="Nenhuma decisão técnica cadastrada para este projeto." description="Use a ação de criação acima para adicionar o primeiro registro." />
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
