import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { getAdminCertification } from "@/services/certifications.service";
import { ApiError } from "@/lib/api/client";
import { CertificationDeleteForm } from "../../CertificationForm";

export const metadata = { title: "Excluir certificação | Admin" };
export default async function DeleteCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  let certification;
  try { certification = await getAdminCertification(Number(id), (await getSessionToken())!); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  return <section className="admin-page max-w-3xl">
    <AdminPageHeader title="Excluir certificação" description={certification.title} actions={<ButtonLink href="/admin/certificacoes" variant="secondary">Cancelar</ButtonLink>} />
    <CertificationDeleteForm id={certification.id} />
  </section>;
}
