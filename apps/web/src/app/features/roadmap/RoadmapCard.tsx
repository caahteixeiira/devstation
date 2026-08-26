import type {
  RoadmapItem,
  RoadmapStatus,
} from "./roadmap";

type RoadmapCardProps = {
  item: RoadmapItem;
};

const statusLabels: Record<RoadmapStatus, string> = {
  now: "Agora",
  next: "Próximo",
  future: "Futuro",
};

export function RoadmapCard({ item }: RoadmapCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <span className="font-mono text-sm uppercase tracking-wider text-primary-strong">
        {statusLabels[item.status]}
      </span>

      <h2 className="mt-3 text-xl font-semibold text-foreground">
        {item.title}
      </h2>

      <p className="mt-3 leading-7 text-foreground-muted">
        {item.description}
      </p>
    </article>
  );
}