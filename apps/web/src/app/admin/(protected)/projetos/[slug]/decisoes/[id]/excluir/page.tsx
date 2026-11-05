import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjectDecisions } from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";
import { deleteDecisionAction } from "./actions";
import { DeleteDecisionForm } from "./DeleteDecisionForm";

export const metadata: Metadata = {
  title: "Excluir decisão técnica",
};

type DeleteDecisionPageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function DeleteDecisionPage({
  params,
}: DeleteDecisionPageProps) {
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
    <section className="max-w-2xl">
      <Link
        href={decisionsPath}
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às decisões técnicas
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Excluir decisão técnica</h1>

      <p className="mt-4 text-foreground-muted">
        A decisão <strong className="text-foreground">{item.title}</strong> será
        removida definitivamente da administração e do portfólio. O projeto{" "}
        <strong className="text-foreground">{project.title}</strong> permanecerá
        cadastrado.
      </p>

      <DeleteDecisionForm
        action={deleteDecisionAction.bind(null, project.slug, item.id)}
      />
    </section>
  );
}
