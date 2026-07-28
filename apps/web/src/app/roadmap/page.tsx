import { PageIntro } from "@/components/layout/PageIntro";

export default function RoadmapPage() {
  return (
    <main className="flex flex-1 px-6 py-16">
      <PageIntro
        eyebrow="Evolução do projeto"
        title="Roadmap"
        description="Acompanhe as próximas etapas do DevStation, os recursos planejados e as decisões que ainda serão implementadas."
      />
    </main>
  );
}
