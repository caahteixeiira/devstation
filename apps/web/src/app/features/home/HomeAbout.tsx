import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { TechList } from "@/components/ui/TechList";
import { formatMonthYear } from "@/lib/dates";
import type { Experience } from "@/types/experience";
import { getHomeExperiences } from "./home-data";
import { HomeSection } from "./HomeSection";

/**
 * Experiência atual: o contrato de Experience tem o campo `current`, que a
 * API valida como incompatível com data de término. Com mais de uma marcada
 * como atual, vale a de início mais recente.
 */
function selectCurrentExperience(experiences: Experience[]): Experience | null {
  const current = experiences
    .filter((experience) => experience.current)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  return current[0] ?? null;
}

async function CurrentExperience() {
  const experiences = await getHomeExperiences();
  const current = experiences.ok
    ? selectCurrentExperience(experiences.data)
    : null;

  if (!current) {
    return null;
  }

  return (
    <Card tone="muted" className="sm:max-w-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
        Hoje
      </p>

      <p className="mt-2 text-lg font-semibold text-foreground">
        {current.role}
      </p>

      <p className="text-foreground-muted">{current.company}</p>

      <p className="mt-2 font-mono text-xs text-foreground-subtle">
        desde {formatMonthYear(current.startDate)}
      </p>

      <TechList
        technologies={current.technologies.slice(0, 6)}
        className="mt-4"
      />
    </Card>
  );
}

/**
 * A citação e a descrição vêm da página Sobre; a experiência atual vem da
 * API e some sozinha quando não há dado.
 */
export function HomeAbout() {
  return (
    <HomeSection labelledBy="about-title" tone="surface">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
            Pessoal
          </p>

          <h2
            id="about-title"
            className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Sobre mim
          </h2>

          <ButtonLink href="/sobre" variant="secondary" className="mt-6">
            Ver experiência completa
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </div>

        <div>
          <figure className="border-l-2 border-accent-strong pl-6">
            <blockquote className="max-w-2xl text-xl leading-9 text-foreground sm:text-2xl sm:leading-10">
              Mais do que fazer uma funcionalidade funcionar, me interessa como
              ela se encaixa no sistema, como será mantida e como poderá
              evoluir.
            </blockquote>

            <figcaption className="mt-5">
              <span className="font-semibold text-foreground">
                {siteConfig.owner}
              </span>

              <span className="text-foreground-muted">
                {" "}
                · desenvolvedora com foco em back-end e automação
              </span>
            </figcaption>
          </figure>

          <div className="mt-8">
            <Suspense fallback={<Skeleton className="h-40 sm:max-w-sm" />}>
              <CurrentExperience />
            </Suspense>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
