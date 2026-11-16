import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { CertificationForm } from "../CertificationForm";

export const metadata = { title: "Nova certificação | Admin" };
export default async function NewCertificationPage() {
  await requireAdmin();
  return <section className="admin-page max-w-4xl">
    <AdminPageHeader title="Nova certificação" description="Salve os dados para habilitar o envio da imagem." actions={<ButtonLink href="/admin/certificacoes" variant="secondary">Voltar</ButtonLink>} />
    <CertificationForm technologies={await listTechnologies()} />
  </section>;
}
