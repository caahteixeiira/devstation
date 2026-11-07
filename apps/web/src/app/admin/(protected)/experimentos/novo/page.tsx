import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjects } from "@/services/projects.service";
import { listTechnologies } from "@/services/technologies.service";
import { CreateExperimentForm } from "./CreateExperimentForm";

export const metadata: Metadata = {
  title: "Novo experimento",
};

export default async function NewExperimentPage() {
  await requireAdmin();

  const [projects, technologies] = await Promise.all([
    listProjects(),
    listTechnologies(),
  ]);

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/experimentos" variant="secondary">Voltar</ButtonLink>} title={<>Novo experimento</>} description={<>Registre uma ideia, um estudo ou uma prova de conceito
        para apresentar no Laboratório.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Experimentos", href: "/admin/experimentos" }, { label: "Novo experimento" }]} />

      <CreateExperimentForm
        projects={projects}
        technologies={technologies}
      />
    </section>
  );
}