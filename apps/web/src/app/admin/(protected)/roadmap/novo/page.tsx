import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateRoadmapForm } from "./CreateRoadmapForm";

export const metadata: Metadata = {
  title: "Novo item de planejamento",
};

export default async function NewRoadmapPage() {
  await requireAdmin();

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/roadmap" variant="secondary">Voltar</ButtonLink>} title={<>Novo item de planejamento</>} description={<>Registre uma etapa da evolução do DevStation.
        O item aparecerá na página pública de Planejamento.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Planejamento", href: "/admin/roadmap" }, { label: "Novo item de planejamento" }]} />

      <CreateRoadmapForm />
    </section>
  );
}