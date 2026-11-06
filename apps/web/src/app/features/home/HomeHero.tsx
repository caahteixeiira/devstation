import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeroStack, ManifestLine } from "./HeroSignals";

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:22px_22px] opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black_25%,transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:px-10 lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
            {siteConfig.tagline}
          </p>

          <h1
            id="hero-title"
            className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            Engenharia de software aplicada a problemas reais.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground-muted">
            Sou {siteConfig.owner}, desenvolvedora com foco em back-end e
            automação. O DevStation reúne minhas decisões técnicas, artigos,
            experimentos e projetos: um produto construído para mostrar como
            eu penso e construo software.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/engenharia">
              Conhecer minha engenharia
              <ArrowRightIcon className="size-4" />
            </ButtonLink>

            <ButtonLink href="/sobre" variant="secondary">
              Ver minha trajetória
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface/80 p-5 font-mono text-sm shadow-card backdrop-blur">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-foreground-subtle">
              {"// devstation.manifest"}
            </span>

            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
            </span>
          </div>

          <dl className="mt-4 space-y-3">
            <ManifestLine label="nome">{siteConfig.owner}</ManifestLine>
            <ManifestLine label="foco">
              backend · automação · arquitetura
            </ManifestLine>

            <Suspense
              fallback={
                <ManifestLine label="stack">
                  <Skeleton className="h-4 w-40" />
                </ManifestLine>
              }
            >
              <HeroStack />
            </Suspense>

            <ManifestLine label="áreas">
              engenharia · artigos · laboratório · planejamento · projetos
            </ManifestLine>
          </dl>
        </div>
      </div>
    </section>
  );
}
