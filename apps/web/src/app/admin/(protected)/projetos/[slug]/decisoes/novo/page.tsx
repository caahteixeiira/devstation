import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getProjectBySlug } from "@/services/projects.service";
import { createDecisionAction } from "./actions";
import { CreateDecisionForm } from "./CreateDecisionForm";

export const metadata: Metadata = {
  title: "Nova decisão técnica",
};

type NewDecisionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewDecisionPage({
  params,
}: NewDecisionPageProps) {
  await requireAdmin();

  const { slug } = await params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    notFound();
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const decisionsPath = `/admin/projetos/${encodeURIComponent(project.slug)}/decisoes`;

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href={decisionsPath} variant="secondary">Voltar</ButtonLink>} title={<>Nova decisão técnica</>} description={<>Projeto: <strong className="text-foreground">{project.title}</strong></>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Decisões técnicas", href: decisionsPath }, { label: "Nova decisão técnica" }]} />

      <CreateDecisionForm
        action={createDecisionAction.bind(null, project.slug)}
      />
    </section>
  );
}
