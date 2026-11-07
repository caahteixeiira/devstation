import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listRoadmapItems } from "@/services/roadmap.service";
import { RoadmapForm } from "../../novo/CreateRoadmapForm";
import { updateRoadmapAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar planejamento",
};

type EditRoadmapPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRoadmapPage({
  params,
}: EditRoadmapPageProps) {
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

  const action = updateRoadmapAction.bind(null, item.id);

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/roadmap" variant="secondary">Voltar</ButtonLink>} title={<>Editar item de planejamento</>} description={<>Atualize o conteúdo, o status e a ordem do item.
        As alterações aparecerão na página de Planejamento.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Planejamento", href: "/admin/roadmap" }, { label: "Editar item de planejamento" }]} />

      <RoadmapForm
        key={item.id}
        initialItem={item}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}