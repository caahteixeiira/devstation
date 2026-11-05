import type { Metadata } from "next";
import Link from "next/link";
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
    <section className="max-w-3xl">
      <Link
        href={decisionsPath}
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às decisões técnicas
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Nova decisão técnica</h1>

      <p className="mt-4 text-foreground-muted">
        Projeto: <strong className="text-foreground">{project.title}</strong>
      </p>

      <CreateDecisionForm
        action={createDecisionAction.bind(null, project.slug)}
      />
    </section>
  );
}
