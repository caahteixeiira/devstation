import { PageIntro } from "@/components/layout/PageIntro";
import { CertificationGridSkeleton } from "@/app/features/certifications/CertificationGridSkeleton";

export default function CertificationsLoading() {
  return (
    <PageIntro eyebrow="Aprendizado" title="Certificações" description="Formação complementar e competências desenvolvidas ao longo da minha trajetória.">
      <div className="mt-12"><CertificationGridSkeleton /></div>
    </PageIntro>
  );
}
