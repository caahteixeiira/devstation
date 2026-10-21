import { PageIntro } from "@/components/layout/PageIntro";

export default function ProjectLoading() {
  return (
    <PageIntro
      eyebrow="Engenharia em prática"
      title="Detalhes do projeto"
      description="Conheça o projeto e suas decisões de engenharia."
    >
      <p
        role="status"
        className="mt-12 rounded-2xl border border-border bg-surface p-6 text-foreground-muted"
      >
        Carregando projeto…
      </p>
    </PageIntro>
  );
}
