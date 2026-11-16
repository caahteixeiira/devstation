import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listCertifications } from "@/services/certifications.service";
import { ApiError } from "@/lib/api/client";
import { CertificationLoadError } from "@/app/features/certifications/CertificationLoadError";
import { CertificationGrid } from "@/app/features/certifications/CertificationGrid";
import { sortCertifications } from "@/app/features/certifications/certifications";
import { HomeSection } from "./HomeSection";

export async function FeaturedCertifications() {
  let certifications;
  try { certifications = await listCertifications(); }
  catch (error) {
    if (!(error instanceof ApiError)) throw error;
    console.error("[certifications] Failed to load home section", error);
    return (
      <HomeSection labelledBy="featured-certifications-title">
        <SectionHeader id="featured-certifications-title" title="Certificações em destaque" />
        <div className="mt-6"><CertificationLoadError /></div>
      </HomeSection>
    );
  }
  const featured = sortCertifications(certifications.filter((item) => item.featured)).slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <HomeSection labelledBy="featured-certifications-title">
      <SectionHeader
        id="featured-certifications-title"
        title="Certificações em destaque"
        action={
          <ButtonLink href="/certificacoes" variant="ghost">
            Ver todas as certificações<ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />
      <div className="mt-6"><CertificationGrid items={featured} compact /></div>
    </HomeSection>
  );
}
