import { PageIntro } from "@/components/layout/PageIntro";
import { RoadmapCard } from "@/app/features/roadmap/RoadmapCard";
import { roadmapItems } from "@/app/features/roadmap/roadmap";

export default function RoadmapPage() {
  return (
    <PageIntro
      eyebrow="Evolução contínua"
      title="Planejamento"
      description="A evolução do DevStation, das funcionalidades em desenvolvimento às próximas etapas da plataforma."
    >
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {roadmapItems.map((item) => (
          <RoadmapCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </PageIntro>
  );
}