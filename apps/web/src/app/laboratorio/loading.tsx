import { PageIntro } from "@/components/layout/PageIntro";

export default function LaboratorioLoading() {
  return (
    <PageIntro
      eyebrow="Experimentação"
      title="Laboratório"
      description="Experimentos, provas de conceito e tecnologias que estou explorando na prática."
      accent="accent"
    >
      <p
        role="status"
        className="mt-10 rounded-2xl border border-border bg-surface p-6 text-foreground-muted"
      >
        Carregando experimentos…
      </p>
    </PageIntro>
  );
}
