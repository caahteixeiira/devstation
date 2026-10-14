import { PageIntro } from "@/components/layout/PageIntro";

export default function ProjetosLoading() {
  return (
    <PageIntro
      eyebrow="Engenharia em prática"
      title="Projetos"
      description="Projetos desenvolvidos com foco em automação, back-end, arquitetura e resolução de problemas reais."
    >
      <p
        role="status"
        className="mt-12 rounded-2xl border border-border bg-surface p-6 text-foreground-muted"
      >
        Carregando projetos…
      </p>
    </PageIntro>
  );
}
