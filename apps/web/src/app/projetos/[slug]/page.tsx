import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { getProjectBySlug } from "@/services/projects.service";
import type { ProjectSummary } from "@/types/project";
import Image from "next/image";

const statusLabels: Record<ProjectSummary["status"], string> = {
  PLANNED: "Planejado",
  IN_DEVELOPMENT: "Em desenvolvimento",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};

const experimentStatusLabels = {
  IDEA: "Ideia",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const sections = [
    { title: "Problema", content: project.problem },
    { title: "Solução", content: project.solution },
    { title: "Arquitetura", content: project.architecture },
  ];

  return (
    <PageIntro
      eyebrow="Engenharia em prática"
      title={project.title}
      description={project.summary}
    >
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link href="/projetos" className="text-primary-strong hover:underline">
          ← Voltar aos projetos
        </Link>

        <span className="rounded-full bg-surface-muted px-3 py-1 font-mono text-sm text-primary-strong">
          {statusLabels[project.status]}
        </span>
      </div>

      {project.technologies.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <li
              key={technology.id}
              className="rounded-lg border border-border px-3 py-1 text-sm"
            >
              {technology.name}
            </li>
          ))}
        </ul>
      )}

      {(project.githubUrl || project.demoUrl) && (
        <div className="mt-8 flex flex-wrap gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-strong hover:underline"
            >
              Ver código no GitHub →
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-strong hover:underline"
            >
              Acessar demonstração →
            </a>
          )}
        </div>
      )}

      <div className="mt-12 space-y-8">
        {project.images.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">Imagens do projeto</h2>

            <div className="mt-6 grid gap-6">
              {project.images.map((image) => (
                <figure key={image.id}>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-muted">
                    <Image
                      src={image.imageUrl}
                      alt={image.altText}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-contain"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        )}
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-2xl font-semibold">{section.title}</h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-foreground-muted">
              {section.content}
            </p>
          </section>
        ))}

        {project.features.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">Funcionalidades</h2>

            <ul className="mt-6 space-y-6">
              {project.features.map((feature) => (
                <li key={feature.id}>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>

                  <p className="mt-2 whitespace-pre-line leading-7 text-foreground-muted">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.improvements.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">Melhorias</h2>

            <ul className="mt-6 list-disc space-y-3 pl-5 text-foreground-muted">
              {project.improvements.map((improvement) => (
                <li
                  key={improvement.id}
                  className="whitespace-pre-line leading-7"
                >
                  {improvement.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.decisions.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">Decisões técnicas</h2>

            <div className="mt-6 space-y-8">
              {project.decisions.map((item) => (
                <article key={item.id}>
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="font-semibold">Contexto</dt>
                      <dd className="mt-1 whitespace-pre-line leading-7 text-foreground-muted">
                        {item.context}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold">Decisão</dt>
                      <dd className="mt-1 whitespace-pre-line leading-7 text-foreground-muted">
                        {item.decision}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold">Consequências</dt>
                      <dd className="mt-1 whitespace-pre-line leading-7 text-foreground-muted">
                        {item.consequences}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        )}

        {project.articles.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">Artigos relacionados</h2>

            <div className="mt-6 space-y-6">
              {project.articles.map((article) => (
                <article key={article.id}>
                  <p className="font-mono text-sm text-primary-strong">
                    {article.category}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {article.title}
                  </h3>

                  <p className="mt-2 leading-7 text-foreground-muted">
                    {article.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {project.experiments.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-2xl font-semibold">
              Experimentos relacionados
            </h2>

            <div className="mt-6 space-y-8">
              {project.experiments.map((experiment) => (
                <article key={experiment.id}>
                  <h3 className="text-xl font-semibold">{experiment.title}</h3>

                  <p className="mt-2 font-mono text-sm text-primary-strong">
                    {experimentStatusLabels[experiment.status]}
                  </p>

                  <p className="mt-4 whitespace-pre-line leading-7 text-foreground-muted">
                    {experiment.objective}
                  </p>

                  {experiment.result && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Resultado</h4>
                      <p className="mt-1 whitespace-pre-line leading-7 text-foreground-muted">
                        {experiment.result}
                      </p>
                    </div>
                  )}

                  {experiment.technologies.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {experiment.technologies.map((technology) => (
                        <li
                          key={technology.id}
                          className="rounded-lg border border-border px-3 py-1 text-sm"
                        >
                          {technology.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageIntro>
  );
}
