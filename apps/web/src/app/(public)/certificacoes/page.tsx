import type { Metadata } from "next";
import { connection } from "next/server";
import { PageIntro } from "@/components/layout/PageIntro";
import { CertificationGrid } from "@/app/features/certifications/CertificationGrid";
import { sortCertifications } from "@/app/features/certifications/certifications";
import { listCertifications } from "@/services/certifications.service";

export const metadata: Metadata = {
  title: "Certificações",
  description: "Certificações, competências e credenciais que complementam a trajetória profissional de Caroline Teixeira.",
};

export default async function CertificacoesPage() {
  await connection();
  const certifications = await listCertifications();
  return (
    <PageIntro
      eyebrow="Aprendizado"
      title="Certificações"
      description="Formação complementar e competências desenvolvidas ao longo da minha trajetória. Consulte os certificados e as credenciais oficiais disponíveis."
      breadcrumb={[{ label: "Início", href: "/" }, { label: "Sobre", href: "/sobre" }, { label: "Certificações" }]}
    >
      <div className="mt-12">
        <CertificationGrid items={sortCertifications(certifications)} />
      </div>
    </PageIntro>
  );
}
