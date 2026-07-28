import { PageIntro } from "@/components/layout/PageIntro";

const projects = [
  {
    title: "Sistema de Chamados",
    description:
      "Aplicação para registrar, distribuir e acompanhar chamados internos, com atribuição automática baseada na carga de trabalho dos responsáveis.",
    technologies: ["PHP", "Laravel", "Vue.js", "Inertia.js", "SQLite"],
    status: "Concluído",
  },
];

export default function ProjetosPage() {
  return (
    <PageIntro
      eyebrow="Engenharia em prática"
      title="Projetos"
      description="Projetos desenvolvidos com foco em automação, back-end, arquitetura e resolução de problemas reais."
    >
      <div className="mt-12 grid gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold">{project.title}</h2>

              <span className="rounded-full bg-surface-muted px-3 py-1 font-mono text-sm text-primary-strong">
                {project.status}
              </span>
            </div>

            <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
              {project.description}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-lg border border-border px-3 py-1 text-sm"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageIntro>
  );
}
