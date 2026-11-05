import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getExperimentById } from "@/services/experiments.service";
import { deleteExperimentAction } from "./actions";
import { DeleteExperimentForm } from "./DeleteExperimentForm";

export const metadata: Metadata = {
  title: "Excluir experimento",
};

type DeleteExperimentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteExperimentPage({
  params,
}: DeleteExperimentPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const experimentId = Number(id);

  if (!Number.isSafeInteger(experimentId)) {
    notFound();
  }

  const experiment = await getExperimentById(experimentId);

  if (!experiment) {
    notFound();
  }

  const action = deleteExperimentAction.bind(null, experiment.id);

  return (
    <section className="max-w-2xl">
      <Link
        href="/admin/experimentos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos experimentos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Excluir experimento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Você está prestes a excluir o experimento{" "}
        <strong className="text-foreground">
          {experiment.title}
        </strong>.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          O experimento, seu objetivo e resultado serão removidos
          definitivamente. Ele deixará de aparecer no Laboratório
          e entre os experimentos relacionados ao projeto.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          O projeto e as tecnologias vinculadas serão mantidos.
        </p>
      </div>

      <DeleteExperimentForm action={action} />
    </section>
  );
}