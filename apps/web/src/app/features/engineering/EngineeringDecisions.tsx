import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { DecisionItem } from "@/app/features/projects/DecisionItem";
import { getEngineeringProject } from "./engineering-data";

const RECENT_LIMIT = 3;

function DecisionsFallback({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card tone="muted">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        {description}
      </p>

      <ButtonLink href={href} variant="secondary" className="mt-5">
        {label}
        <ArrowRightIcon className="size-4" />
      </ButtonLink>
    </Card>
  );
}

/**
 * ADRs do projeto DevStation. A numeração é a mesma do case study: posição
 * na lista ordenada por createdAt crescente. Mostra as mais recentes.
 */
export async function EngineeringDecisions() {
  const project = await getEngineeringProject();
  const slug = siteConfig.engineeringProjectSlug;

  let content;

  if (!project.ok || !project.data || !slug) {
    content = (
      <DecisionsFallback
        title="As decisões técnicas ficam documentadas em cada case study"
        description="Contexto, decisão e consequências acompanham o projeto em que foram tomadas."
        href="/projetos"
        label="Ver projetos"
      />
    );
  } else {
    const numbered = [...project.data.decisions]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((decision, index) => ({ decision, index: index + 1 }));

    const recent = numbered.slice(-RECENT_LIMIT).reverse();

    content =
      recent.length === 0 ? (
        <DecisionsFallback
          title="O projeto DevStation ainda não tem decisões registradas"
          description="Quando forem cadastradas, aparecem aqui com a mesma numeração do case study."
          href={`/projetos/${encodeURIComponent(slug)}`}
          label="Ver o case study"
        />
      ) : (
        <div className="space-y-4">
          {recent.map(({ decision, index }) => (
            <DecisionItem key={decision.id} decision={decision} index={index} />
          ))}
        </div>
      );
  }

  const allHref = slug
    ? `/projetos/${encodeURIComponent(slug)}#decisoes`
    : "/projetos";

  return (
    <section aria-labelledby="decisions-title">
      <SectionHeader
        id="decisions-title"
        eyebrow="ADRs"
        title="Decisões técnicas recentes"
        description="Registros de decisão do próprio DevStation, numerados exatamente como no case study do projeto."
        action={
          <ButtonLink href={allHref} variant="ghost" size="sm">
            Todas as decisões
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />

      <div className="mt-6">{content}</div>
    </section>
  );
}

export function EngineeringDecisionsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="mt-3 h-8 w-72" />

      <div className="mt-6 space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
