import type { Metadata } from "next";
import Link from "next/link";
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
    <section className="max-w-3xl">
      <Link
        href="/admin/roadmap"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar ao planejamento
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Editar item de planejamento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Atualize o conteúdo, o status e a ordem do item.
        As alterações aparecerão na página de Planejamento.
      </p>

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