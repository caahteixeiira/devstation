import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
} from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechList } from "@/components/ui/TechList";
import { CaseSection } from "@/app/features/projects/CaseSection";
import { DecisionItem } from "@/app/features/projects/DecisionItem";
import { ProjectToc, type TocItem } from "@/app/features/projects/ProjectToc";
import { formatDate } from "@/lib/dates";
import { countLabel } from "@/lib/text";
import { getProjectBySlug } from "@/services/projects.service";
import type { ProjectDetail } from "@/types/project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/** Uma única chamada por requisição, compartilhada entre metadata e página. */
const loadProject = cache((slug: string) => getProjectBySlug(slug));

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    return { title: "Projeto não encontrado" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function groupTechnologies(technologies: ProjectDetail["technologies"]) {
  const groups = new Map<string, ProjectDetail["technologies"]>();

  for (const technology of technologies) {
    const list = groups.get(technology.category) ?? [];
    list.push(technology);
    groups.set(technology.category, list);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function CaseText({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line leading-7 text-foreground-muted">
      {text}
    </p>
  );
}

const articleLinkStyles =
  "group grid gap-1 rounded-sm py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  const [heroImage, ...galleryImages] = byOrder(project.images);
  const features = byOrder(project.features);
  const improvements = byOrder(project.improvements);
  const decisions = [...project.decisions].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const technologyGroups = groupTechnologies(project.technologies);

  // Só seções presentes entram no índice e recebem numeração.
  const sections: TocItem[] = [
    { id: "problema", label: "Contexto e problema" },
    { id: "solucao", label: "Solução" },
    { id: "arquitetura", label: "Arquitetura" },
    ...(features.length > 0
      ? [{ id: "funcionalidades", label: "Funcionalidades" }]
      : []),
    ...(decisions.length > 0
      ? [{ id: "decisoes", label: "Decisões técnicas" }]
      : []),
    ...(galleryImages.length > 0 ? [{ id: "imagens", label: "Imagens" }] : []),
    ...(improvements.length > 0 ? [{ id: "evolucao", label: "Evolução" }] : []),
    ...(project.articles.length > 0
      ? [{ id: "artigos", label: "Artigos relacionados" }]
      : []),
    ...(project.experiments.length > 0
      ? [{ id: "experimentos", label: "Experimentos relacionados" }]
      : []),
  ];

  const sectionNumber = (id: string) =>
    String(sections.findIndex((section) => section.id === id) + 1).padStart(
      2,
      "0",
    );

  const metaParts = [
    decisions.length > 0
      ? countLabel(decisions.length, "decisão técnica", "decisões técnicas")
      : null,
    features.length > 0 ? countLabel(features.length, "funcionalidade") : null,
    `atualizado em ${formatDate(project.updatedAt)}`,
  ].filter((part): part is string => part !== null);

  const externalActions =
    project.githubUrl || project.demoUrl ? (
      <>
        {project.githubUrl && (
          <ButtonLink href={project.githubUrl} external variant="secondary">
            <CodeIcon className="size-4" />
            Código
          </ButtonLink>
        )}

        {project.demoUrl && (
          <ButtonLink href={project.demoUrl} external variant="secondary">
            Demonstração
            <ArrowUpRightIcon className="size-4" />
          </ButtonLink>
        )}
      </>
    ) : undefined;

  return (
    <PageIntro
      eyebrow="Case study"
      title={project.title}
      description={project.summary}
      breadcrumb={[
        { label: "Projetos", href: "/projetos" },
        { label: project.title },
      ]}
      meta={<StatusBadge kind="project" status={project.status} />}
      actions={externalActions}
    >
      <TechList technologies={project.technologies} className="mt-6" />

      <p className="mt-4 font-mono text-xs text-foreground-subtle">
        {metaParts.join(" · ")}
      </p>

      {heroImage && (
        <Card padding="none" className="mt-10 overflow-hidden">
          <figure>
            <div className="relative aspect-video bg-surface-muted">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.altText}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-contain"
              />
            </div>

            <figcaption className="border-t border-border px-4 py-2 font-mono text-xs text-foreground-subtle">
              {heroImage.altText}
            </figcaption>
          </figure>
        </Card>
      )}

      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
        <div className="min-w-0 max-w-3xl space-y-14">
          <ProjectToc items={sections} variant="mobile" />

          <CaseSection
            id="problema"
            eyebrow={sectionNumber("problema")}
            title="Contexto e problema"
          >
            <CaseText text={project.problem} />
          </CaseSection>

          <CaseSection
            id="solucao"
            eyebrow={sectionNumber("solucao")}
            title="Solução"
          >
            <CaseText text={project.solution} />
          </CaseSection>

          <CaseSection
            id="arquitetura"
            eyebrow={sectionNumber("arquitetura")}
            title="Arquitetura"
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_15rem]">
              <Card tone="muted">
                <p className="font-mono text-xs text-foreground-subtle">
                  {"// arquitetura"}
                </p>

                <p className="mt-3 whitespace-pre-line leading-7 text-foreground-muted">
                  {project.architecture}
                </p>
              </Card>

              {technologyGroups.length > 0 && (
                <Card tone="muted" className="xl:self-start">
                  <p className="font-mono text-xs text-foreground-subtle">
                    {"// stack"}
                  </p>

                  <dl className="mt-3 space-y-4">
                    {technologyGroups.map(([category, technologies]) => (
                      <div key={category}>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
                          {category}
                        </dt>

                        <dd className="mt-1.5">
                          <TechList
                            technologies={technologies}
                            label={`Tecnologias de ${category}`}
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              )}
            </div>
          </CaseSection>

          {features.length > 0 && (
            <CaseSection
              id="funcionalidades"
              eyebrow={sectionNumber("funcionalidades")}
              title="Funcionalidades"
            >
              <ul className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <Card key={feature.id} as="li" tone="muted" padding="sm">
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-foreground-muted">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </ul>
            </CaseSection>
          )}

          {decisions.length > 0 && (
            <CaseSection
              id="decisoes"
              eyebrow={sectionNumber("decisoes")}
              title="Decisões técnicas"
              description="Registros de decisão de arquitetura: o contexto, a escolha e o que ela implica."
            >
              <div className="space-y-4">
                {decisions.map((decision, index) => (
                  <DecisionItem
                    key={decision.id}
                    decision={decision}
                    index={index + 1}
                  />
                ))}
              </div>
            </CaseSection>
          )}

          {galleryImages.length > 0 && (
            <CaseSection
              id="imagens"
              eyebrow={sectionNumber("imagens")}
              title="Imagens"
            >
              <ul className="grid gap-4 sm:grid-cols-2">
                {galleryImages.map((image) => (
                  <li key={image.id}>
                    <figure>
                      <Card padding="none" className="overflow-hidden">
                        <div className="relative aspect-video bg-surface-muted">
                          <Image
                            src={image.imageUrl}
                            alt={image.altText}
                            fill
                            sizes="(max-width: 640px) 100vw, 400px"
                            className="object-contain"
                          />
                        </div>
                      </Card>

                      <figcaption className="mt-2 font-mono text-xs text-foreground-subtle">
                        {image.altText}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </CaseSection>
          )}

          {improvements.length > 0 && (
            <CaseSection
              id="evolucao"
              eyebrow={sectionNumber("evolucao")}
              title="Evolução"
              description="Melhorias mapeadas para as próximas iterações."
            >
              <ol className="space-y-2">
                {improvements.map((improvement, index) => (
                  <li
                    key={improvement.id}
                    className="flex gap-4 rounded-control border border-border bg-surface px-4 py-3"
                  >
                    <span className="pt-1 font-mono text-xs text-primary-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="whitespace-pre-line leading-7 text-foreground-muted">
                      {improvement.description}
                    </p>
                  </li>
                ))}
              </ol>
            </CaseSection>
          )}

          {project.articles.length > 0 && (
            <CaseSection
              id="artigos"
              eyebrow={sectionNumber("artigos")}
              title="Artigos relacionados"
            >
              <ol className="divide-y divide-border border-y border-border">
                {project.articles.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/artigos/${encodeURIComponent(article.slug)}`}
                      className={articleLinkStyles}
                    >
                      <span className="font-mono text-xs text-primary-strong">
                        {article.category}
                      </span>

                      <span className="min-w-0">
                        <span className="block font-medium text-foreground transition-colors group-hover:text-primary-strong motion-reduce:transition-none">
                          {article.title}
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-foreground-muted">
                          {article.summary}
                        </span>
                      </span>

                      {article.publishedAt && (
                        <time
                          dateTime={article.publishedAt}
                          className="font-mono text-xs text-foreground-subtle"
                        >
                          {formatDate(article.publishedAt)}
                        </time>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </CaseSection>
          )}

          {project.experiments.length > 0 && (
            <CaseSection
              id="experimentos"
              eyebrow={sectionNumber("experimentos")}
              title="Experimentos relacionados"
            >
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.experiments.map((experiment) => (
                  <Card key={experiment.id} as="li" padding="sm">
                    <StatusBadge kind="experiment" status={experiment.status} />

                    <h3 className="mt-3 font-semibold text-foreground">
                      {experiment.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-sm leading-6 text-foreground-muted">
                      {experiment.objective}
                    </p>

                    {experiment.result && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
                          Resultado
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground-muted">
                          {experiment.result}
                        </p>
                      </div>
                    )}

                    <TechList
                      technologies={experiment.technologies}
                      max={4}
                      className="mt-3"
                    />
                  </Card>
                ))}
              </ul>
            </CaseSection>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <ButtonLink href="/projetos" variant="ghost">
              <ArrowRightIcon className="size-4 rotate-180" />
              Todos os projetos
            </ButtonLink>

            {project.githubUrl && (
              <ButtonLink href={project.githubUrl} external variant="secondary">
                <CodeIcon className="size-4" />
                Código no GitHub
              </ButtonLink>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <ProjectToc items={sections} variant="desktop" />
          </div>
        </aside>
      </div>
    </PageIntro>
  );
}
