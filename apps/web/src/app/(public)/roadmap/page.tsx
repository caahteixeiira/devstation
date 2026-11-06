import type { Metadata } from "next";
import { connection } from "next/server";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapIcon } from "@/components/ui/icons";
import { RoadmapGroup } from "@/app/features/roadmap/RoadmapGroup";
import { roadmapPageIntro } from "@/app/features/roadmap/intro";
import { countLabel } from "@/lib/text";
import { listRoadmapItems } from "@/services/roadmap.service";
import type { RoadmapItem } from "@/types/roadmap";

/** Ordem de leitura: do que está acontecendo ao que já foi entregue. */
const statusOrder: RoadmapItem["status"][] = [
  "NOW",
  "NEXT",
  "FUTURE",
  "COMPLETED",
];

const countLabels: Record<RoadmapItem["status"], [string, string]> = {
  NOW: ["em andamento", "em andamento"],
  NEXT: ["próximo", "próximos"],
  FUTURE: ["futuro", "futuros"],
  COMPLETED: ["concluído", "concluídos"],
};

export const metadata: Metadata = {
  title: "Planejamento",
  description: "A evolução do DevStation, das funcionalidades em desenvolvimento às próximas etapas da plataforma.",
};

export default async function RoadmapPage() {
  await connection();
  const roadmapItems = await listRoadmapItems();

  const groups = statusOrder
    .map((status) => ({
      status,
      items: roadmapItems.filter((item) => item.status === status),
    }))
    .filter((group) => group.items.length > 0);

  const completed = roadmapItems.filter(
    (item) => item.status === "COMPLETED",
  ).length;
  const total = roadmapItems.length;
  const summary = groups
    .map((group) => countLabel(group.items.length, ...countLabels[group.status]))
    .join(" · ");

  return (
    <PageIntro
      {...roadmapPageIntro}
      meta={
        total > 0 ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {countLabel(total, "item", "itens")}
          </span>
        ) : undefined
      }
    >
      {total === 0 ? (
        <EmptyState
          className="mt-12"
          icon={<MapIcon />}
          title="Nenhum item de planejamento disponível ainda."
          description="As etapas do DevStation aparecem aqui assim que forem registradas."
        />
      ) : (
        <>
          <div className="mt-8 max-w-xl">
            <p className="font-mono text-xs text-foreground-subtle">{summary}</p>

            <div className="mt-3 flex items-center gap-3">
              <div
                role="progressbar"
                aria-label="Itens do roadmap concluídos"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={completed}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"
              >
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${Math.round((completed / total) * 100)}%` }}
                />
              </div>

              <p className="shrink-0 font-mono text-xs text-foreground-muted">
                {completed} de {total} itens do roadmap concluídos
              </p>
            </div>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-3 top-2 w-px bg-border"
            />

            <div className="space-y-14">
              {groups.map((group) => (
                <RoadmapGroup
                  key={group.status}
                  status={group.status}
                  items={group.items}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </PageIntro>
  );
}
