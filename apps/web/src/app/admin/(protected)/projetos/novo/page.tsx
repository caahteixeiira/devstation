import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateProjectForm } from "./CreateProjectForm";
import { listTechnologies } from "@/services/technologies.service";

export const metadata: Metadata = {
  title: "Novo projeto",
};

export default async function NewProjectPage() {
  await requireAdmin();
  const technologies = await listTechnologies();

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/projetos" variant="secondary">Voltar</ButtonLink>} title={<>Novo projeto</>} description={<>Preencha os dados principais do projeto.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Projetos", href: "/admin/projetos" }, { label: "Novo projeto" }]} />

      <CreateProjectForm technologies={technologies} />
    </section>
  );
}