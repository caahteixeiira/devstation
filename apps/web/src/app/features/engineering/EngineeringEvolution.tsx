import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { RoadmapItem } from "@/types/roadmap";
import { getEngineeringRoadmap } from "./engineering-data";

const LIMIT = 4;
const statusOrder: Record<RoadmapItem["status"], number> = {
  NOW: 0,
  NEXT: 1,
  FUTURE: 2,
  COMPLETED: 3,
};

/** Itens do Planejamento em andamento ou próximos. Some sem dados. */
export async function EngineeringEvolution() {
  const roadmap = await getEngineeringRoadmap();

  if (!roadmap.ok) {
    return null;
  }

  const items = roadmap.data
    .filter((item) => item.status === "NOW" || item.status === "NEXT")
    .sort(
      (a, b) =>
        statusOrder[a.status] - statusOrder[b.status] || a.order - b.order,
    )
    .slice(0, LIMIT);

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="evolution-title">
      <SectionHeader
        id="evolution-title"
        eyebrow="Evolução"
        title="Para onde a arquitetura vai"
        description="O que está em andamento e o que vem a seguir no planejamento do DevStation."
        action={
          <ButtonLink href="/roadmap" variant="ghost" size="sm">
            Ver planejamento
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />

      <ol className="mt-4 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
          >
            <div>
              <StatusBadge kind="roadmap" status={item.status} />
            </div>

            <div className="min-w-0">
              <p className="font-medium text-foreground">{item.title}</p>

              <p className="mt-1 line-clamp-2 text-sm leading-6 text-foreground-muted">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
