import { Suspense } from "react";
import { listCertifications } from "@/services/certifications.service";
import { ApiError } from "@/lib/api/client";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CertificationGrid } from "./CertificationGrid";
import { sortCertifications } from "./certifications";
import { CertificationGridSkeleton } from "./CertificationGridSkeleton";
import { CertificationLoadError } from "./CertificationLoadError";

async function CertificationPreviewList() {
  let certifications;
  try {
    certifications = await listCertifications();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    console.error("[certifications] Failed to load about section", error);
    return <CertificationLoadError />;
  }
  return <CertificationGrid items={sortCertifications(certifications).slice(0, 4)} />;
}

export function CertificationsSection() {

  return (
    <section id="certificacoes" aria-labelledby="certifications-title" className="mt-16">
      <SectionHeader
        id="certifications-title"
        eyebrow="Aprendizado"
        title="Certificações"
        description="Certificados e competências que complementam minha trajetória profissional."
        action={
          <ButtonLink href="/certificacoes" variant="ghost">
            Ver todas as certificações<ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />

      <div className="mt-6">
        <Suspense fallback={<CertificationGridSkeleton />}><CertificationPreviewList /></Suspense>
      </div>
    </section>
  );
}
