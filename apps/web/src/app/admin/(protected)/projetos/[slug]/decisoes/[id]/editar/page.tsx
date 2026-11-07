import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjectDecisions } from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";
import { DecisionForm } from "../../novo/CreateDecisionForm";
import { updateDecisionAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar decisão técnica",
};

type EditDecisionPageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function EditDecisionPage({
  params,
}: EditDecisionPageProps) {
  await requireAdmin();

  const { slug, id } = await params;
  const decisionId = Number(id);

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(decisionId)
  ) {
    notFound();
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const decisions = await listProjectDecisions(project.id);
  const item = decisions.find((entry) => entry.id === decisionId);

  if (!item) {
    notFound();
  }

  const decisionsPath = `/admin/projetos/${encodeURIComponent(project.slug)}/decisoes`;

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href={decisionsPath} variant="secondary">Voltar</ButtonLink>} title={<>Editar decisão técnica</>} description={<>Projeto: <strong className="text-foreground">{project.title}</strong></>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Decisões técnicas", href: decisionsPath }, { label: "Editar decisão técnica" }]} />

      <DecisionForm
        key={item.id}
        initialDecision={item}
        action={updateDecisionAction.bind(null, project.slug, item.id)}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}
