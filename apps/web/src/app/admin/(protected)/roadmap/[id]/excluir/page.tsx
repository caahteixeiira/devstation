import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listRoadmapItems } from "@/services/roadmap.service";
import { deleteRoadmapAction } from "./actions";
import { DeleteRoadmapForm } from "./DeleteRoadmapForm";

export const metadata: Metadata = {
  title: "Excluir item de planejamento",
};

type DeleteRoadmapPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteRoadmapPage({
  params,
}: DeleteRoadmapPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const itemId = Number(id);

  if (!Number.isSafeInteger(itemId)) {
    notFound();
  }

  const items = await listRoadmapItems();
  const item = items.find((entry) => entry.id === itemId);

  if (!item) {
    notFound();
  }

  const action = deleteRoadmapAction.bind(null, item.id);

  return (
    <section className="admin-page max-w-4xl admin-delete-page">
      <AdminPageHeader actions={<ButtonLink href="/admin/roadmap" variant="secondary">Cancelar exclusão</ButtonLink>} title={<>Excluir item de planejamento</>} description={<>Você está prestes a excluir o item{" "}
        <strong className="text-foreground">
          {item.title}
        </strong>.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Planejamento", href: "/admin/roadmap" }, { label: "Excluir item de planejamento" }]} />

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          O item será removido definitivamente da administração
          e da página pública de Planejamento.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          Os demais itens serão mantidos, com seus valores
          atuais de ordem.
        </p>
      </div>

      <DeleteRoadmapForm action={action} />
    </section>
  );
}