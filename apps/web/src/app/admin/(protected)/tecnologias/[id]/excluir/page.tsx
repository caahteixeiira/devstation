import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { deleteTechnologyAction } from "./actions";
import { DeleteTechnologyForm } from "./DeleteTechnologyForm";

export const metadata: Metadata = {
  title: "Excluir tecnologia",
};

type DeleteTechnologyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteTechnologyPage({
  params,
}: DeleteTechnologyPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const technologyId = Number(id);

  if (!Number.isSafeInteger(technologyId)) {
    notFound();
  }

  const technologies = await listTechnologies();

  const technology = technologies.find(
    (item) => item.id === technologyId,
  );

  if (!technology) {
    notFound();
  }

  const action = deleteTechnologyAction.bind(null, technology.id);

  return (
    <section className="max-w-2xl">
      <Link
        href="/admin/tecnologias"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às tecnologias
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Excluir tecnologia
      </h1>

      <p className="mt-4 text-foreground-muted">
        Você está prestes a excluir a tecnologia{" "}
        <strong className="text-foreground">
          {technology.name}
        </strong>
        , da categoria {technology.category}.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          A tecnologia será removida do cadastro e deixará de
          aparecer nos projetos, experiências e experimentos
          aos quais está vinculada.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          Os projetos, experiências e experimentos serão mantidos.
        </p>
      </div>

      <DeleteTechnologyForm action={action} />
    </section>
  );
}