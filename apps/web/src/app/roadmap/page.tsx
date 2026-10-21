import { PageIntro } from "@/components/layout/PageIntro";
import { RoadmapCard } from "@/app/features/roadmap/RoadmapCard";
import { listRoadmapItems } from "@/services/roadmap.service";

export default async function RoadmapPage() {
  const roadmapItems = await listRoadmapItems();

  return (
    <PageIntro
      eyebrow="Evolução contínua"
      title="Planejamento"
      description="A evolução do DevStation, das funcionalidades em desenvolvimento às próximas etapas da plataforma."
    >
      {roadmapItems.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum item de planejamento disponível no momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {roadmapItems.map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageIntro>
  );
}
