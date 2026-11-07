import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { CreateExperienceForm } from "./CreateExperienceForm";

export const metadata: Metadata = {
  title: "Nova experiência",
};

export default async function NewExperiencePage() {
  await requireAdmin();

  const technologies = await listTechnologies();

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/experiencias" variant="secondary">Voltar</ButtonLink>} title={<>Nova experiência</>} description={<>Cadastre uma experiência para apresentar sua trajetória
        profissional na página Sobre.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Experiências", href: "/admin/experiencias" }, { label: "Nova experiência" }]} />

      <CreateExperienceForm technologies={technologies} />
    </section>
  );
}