import { PageIntro } from "@/components/layout/PageIntro";

export default function RoadmapLoading() {
  return (
    <PageIntro
      eyebrow="Evolução contínua"
      title="Planejamento"
      description="A evolução do DevStation, das funcionalidades em desenvolvimento às próximas etapas da plataforma."
    >
      <p
        role="status"
        className="mt-10 rounded-2xl border border-border bg-surface p-6 text-foreground-muted"
      >
        Carregando planejamento…
      </p>
    </PageIntro>
  );
}
