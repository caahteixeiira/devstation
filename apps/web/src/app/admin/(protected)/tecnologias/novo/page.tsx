import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateTechnologyForm } from "./CreateTechnologyForm";

export const metadata: Metadata = {
  title: "Nova tecnologia",
};

export default async function NewTechnologyPage() {
  await requireAdmin();

  return (
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/tecnologias" variant="secondary">Voltar</ButtonLink>} title={<>Nova tecnologia</>} description={<>Cadastre uma tecnologia para vincular aos projetos,
        experiências e experimentos.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Tecnologias", href: "/admin/tecnologias" }, { label: "Nova tecnologia" }]} />

      <CreateTechnologyForm />
    </section>
  );
}