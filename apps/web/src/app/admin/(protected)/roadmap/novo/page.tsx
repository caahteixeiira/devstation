import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateRoadmapForm } from "./CreateRoadmapForm";

export const metadata: Metadata = {
  title: "Novo item de planejamento",
};

export default async function NewRoadmapPage() {
  await requireAdmin();

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/roadmap"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar ao planejamento
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Novo item de planejamento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Registre uma etapa da evolução do DevStation.
        O item aparecerá na página pública de Planejamento.
      </p>

      <CreateRoadmapForm />
    </section>
  );
}