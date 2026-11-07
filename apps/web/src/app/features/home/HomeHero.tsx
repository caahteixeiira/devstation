import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeroStack, ManifestLine } from "./HeroSignals";

export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="hero-section border-b border-border">
      <div className="public-container public-gutter hero-content grid gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-12">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Backend · Automação · Engenharia de software
          </p>
          <h1 id="hero-title" className="hero-title mt-7">
            Engenharia de software aplicada a problemas reais.
          </h1>
          <p className="hero-description mt-8 text-foreground-muted">
            Sou {siteConfig.owner}, desenvolvedora com foco em backend e automação.
            O DevStation reúne minhas decisões técnicas, artigos, experimentos e
            projetos: um retrato de como penso e construo software.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/engenharia" className="public-button">
              Conhecer minha engenharia
              <ArrowUpRightIcon className="size-4 shrink-0" />
            </ButtonLink>
            <ButtonLink href="/sobre" variant="secondary" className="public-button public-button-outline">
              Ver minha trajetória
            </ButtonLink>
          </div>
        </div>
        <aside aria-labelledby="interests-title" className="hero-card border border-border p-7 sm:p-9">
          <h2 id="interests-title" className="hero-card-heading flex items-center justify-between gap-4">
            Interesses técnicos
          </h2>
          <dl className="mt-8">
            <ManifestLine label="Foco">Backend e automação</ManifestLine>
            <Suspense fallback={<ManifestLine label="Tecnologias"><Skeleton className="h-5 w-40" /></ManifestLine>}>
              <HeroStack />
            </Suspense>
            <ManifestLine label="Áreas">Engenharia · Artigos · Laboratório · Planejamento</ManifestLine>
          </dl>
        </aside>
      </div>
    </section>
  );
}
