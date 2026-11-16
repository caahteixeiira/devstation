import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageManager } from "@/components/admin/ImageManager";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";
import { listTechnologies } from "@/services/technologies.service";
import { getAdminCertification } from "@/services/certifications.service";
import { CertificationForm } from "../../CertificationForm";

export const metadata = { title: "Editar certificação | Admin" };
export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  let certification;
  try { certification = await getAdminCertification(Number(id), (await getSessionToken())!); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  return <section className="admin-page max-w-4xl">
    <AdminPageHeader title="Editar certificação" description={certification.title} actions={<ButtonLink href="/admin/certificacoes" variant="secondary">Voltar</ButtonLink>} />
    {certification.deleting ? <p role="alert">Exclusão pendente. Conclua a exclusão pela listagem antes de editar.</p> : <>
      <CertificationForm certification={certification} technologies={await listTechnologies()} />
      <ImageManager kind="certification" id={certification.id} images={certification.imageUrl ? [{ id: certification.id, imageUrl: certification.imageUrl, altText: certification.imageAlt || `Certificado ${certification.title}`, order: 0 }] : []} />
    </>}
  </section>;
}
