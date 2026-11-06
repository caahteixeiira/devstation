import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MaturityBadge, type Maturity } from "./MaturityBadge";

type RepoArea = {
  path: string;
  title: string;
  description: string;
  maturity: Maturity;
};

/** Áreas que existem hoje no repositório. */
const areas: RepoArea[] = [
  {
    path: "apps/web",
    title: "Aplicação web",
    description:
      "Interface pública, painel administrativo e sessão autenticada, construídos com Next.js, React, TypeScript e Tailwind CSS. Consome a API validando os contratos das respostas.",
    maturity: "implemented",
  },
  {
    path: "apps/api",
    title: "API do DevStation",
    description:
      "Fastify e TypeScript, organizada em oito módulos: projetos, tecnologias, decisões, artigos, experimentos, experiências, planejamento e autenticação. Validação com Zod, Prisma e PostgreSQL.",
    maturity: "implemented",
  },
  {
    path: "docs/",
    title: "Documentação técnica",
    description:
      "Modelo de dados documentado em docs/architecture/database.md. As decisões arquiteturais ficam registradas nos case studies.",
    maturity: "in-progress",
  },
];

export function RepoLayout() {
  return (
    <section aria-labelledby="repo-title">
      <SectionHeader
        id="repo-title"
        eyebrow="Organização"
        title="Estrutura do repositório"
        description="Monorepo com as aplicações e a documentação em um único lugar, permitindo desenvolver cada parte separadamente com configurações compartilhadas."
      />

      <ul className="mt-6 grid gap-4 lg:grid-cols-3">
        {areas.map((area) => (
          <Card key={area.path} as="li" padding="sm" className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-primary-strong">
                {area.path}
              </p>

              <MaturityBadge maturity={area.maturity} />
            </div>

            <h3 className="mt-3 font-semibold text-foreground">{area.title}</h3>

            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              {area.description}
            </p>
          </Card>
        ))}
      </ul>
    </section>
  );
}
