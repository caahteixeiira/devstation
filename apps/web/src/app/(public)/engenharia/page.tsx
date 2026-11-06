import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card, cardClassName } from "@/components/ui/Card";
import {
  ArrowRightIcon,
  FlaskIcon,
  FolderIcon,
  MapIcon,
} from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArchitectureFlow } from "@/app/features/engineering/ArchitectureFlow";
import { EngineeringArticles } from "@/app/features/engineering/EngineeringArticles";
import {
  EngineeringDecisions,
  EngineeringDecisionsSkeleton,
} from "@/app/features/engineering/EngineeringDecisions";
import { EngineeringEvolution } from "@/app/features/engineering/EngineeringEvolution";
import { QualityStatus } from "@/app/features/engineering/QualityStatus";
import { RepoLayout } from "@/app/features/engineering/RepoLayout";

type Principle = {
  label: string;
  title: string;
  description: string;
};

/** Princípios em uso, verificados no código. */
const principles: Principle[] = [
  {
    label: "Organização do repositório",
    title: "Monorepo",
    description:
      "Mantém aplicações, pacotes e configurações em um único repositório, facilitando o compartilhamento de recursos e a execução centralizada das tarefas.",
  },
  {
    label: "Organização da aplicação",
    title: "Modular Monolith",
    description:
      "Organiza o back-end em módulos com responsabilidades bem definidas, mantendo inicialmente uma única aplicação implantável e permitindo sua evolução gradual.",
  },
  {
    label: "Renderização",
    title: "Server Components por padrão",
    description:
      "As páginas buscam dados no servidor em tempo de requisição, sem depender da API durante o build.",
  },
  {
    label: "Integração",
    title: "Contratos validados na integração",
    description:
      "Toda resposta da API que carrega dados passa por um schema Zod antes de chegar à tela. Só as exclusões, sem corpo de resposta, ficam fora.",
  },
  {
    label: "Resiliência",
    title: "Degradação por seção",
    description:
      "Uma falha de API derruba apenas a seção que depende dela, registra o erro e preserva o restante da página.",
  },
];

const relatedAreas = [
  {
    href: "/projetos",
    title: "Projetos",
    description:
      "Os case studies onde as decisões aparecem aplicadas, com contexto, solução e consequências.",
    icon: FolderIcon,
  },
  {
    href: "/laboratorio",
    title: "Laboratório",
    description:
      "Experimentação que ainda não virou decisão: hipóteses, provas de conceito e aprendizado em exploração.",
    icon: FlaskIcon,
  },
  {
    href: "/roadmap",
    title: "Planejamento",
    description:
      "A evolução do DevStation, do que está em andamento às próximas etapas da plataforma.",
    icon: MapIcon,
  },
];

export const metadata: Metadata = {
  title: "Engenharia",
  description: "Como o DevStation foi arquitetado, organizado e decidido, e para onde a plataforma evolui.",
};

export default async function EngenhariaPage() {
  await connection();

  return (
    <PageIntro
      eyebrow="Arquitetura e decisões técnicas"
      title="Engenharia"
      description="Como o DevStation foi arquitetado, organizado e decidido, e para onde a plataforma evolui. Documentação viva do próprio sistema."
    >
      <div className="mt-12 space-y-16">
        <section aria-labelledby="flow-title">
          <SectionHeader
            id="flow-title"
            eyebrow="Visão geral"
            title="Como o DevStation funciona"
            description="Uma requisição atravessa quatro camadas: a aplicação web pede dados à API, que acessa o banco pelo Prisma. A resposta volta validada antes de virar tela."
          />

          <ArchitectureFlow className="mt-8 lg:mt-6" />
        </section>

        <RepoLayout />

        <section aria-labelledby="principles-title">
          <SectionHeader
            id="principles-title"
            eyebrow="Princípios"
            title="Como a arquitetura foi definida"
            description="Cada escolha técnica parte de um problema real, de uma responsabilidade bem definida e dos impactos que ela terá na evolução do projeto."
          />

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <Card key={principle.title} as="li" tone="muted" padding="sm">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
                  {principle.label}
                </p>

                <h3 className="mt-2 font-semibold text-foreground">
                  {principle.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {principle.description}
                </p>
              </Card>
            ))}
          </ul>
        </section>

        <Suspense fallback={<EngineeringDecisionsSkeleton />}>
          <EngineeringDecisions />
        </Suspense>

        <QualityStatus />

        <Suspense fallback={<Skeleton className="h-40" />}>
          <EngineeringEvolution />
        </Suspense>

        <Suspense fallback={null}>
          <EngineeringArticles />
        </Suspense>

        <section aria-labelledby="related-title">
          <SectionHeader
            id="related-title"
            eyebrow="Onde isso aparece"
            title="Engenharia na prática"
          />

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {relatedAreas.map((area) => {
              const Icon = area.icon;

              return (
                <li key={area.href}>
                  <Link
                    href={area.href}
                    className={cardClassName(
                      { interactive: true, padding: "sm" },
                      "group flex h-full flex-col",
                    )}
                  >
                    <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary-strong">
                      <Icon className="size-4" />
                    </span>

                    <h3 className="mt-4 font-semibold text-foreground">
                      {area.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                      {area.description}
                    </p>

                    <span className="mt-auto flex items-center gap-1 pt-4 font-mono text-xs text-foreground-subtle transition-colors group-hover:text-primary-strong motion-reduce:transition-none">
                      Explorar
                      <ArrowRightIcon className="size-3.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </PageIntro>
  );
}
