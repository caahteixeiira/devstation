import { Card } from "@/components/ui/Card";
import { CheckIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { roadmapStatus } from "@/components/ui/status";
import { cx } from "@/lib/cx";
import { formatDate } from "@/lib/dates";
import { countLabel } from "@/lib/text";
import type { RoadmapItem } from "@/types/roadmap";

type RoadmapStatus = RoadmapItem["status"];

type RoadmapGroupProps = {
  status: RoadmapStatus;
  items: RoadmapItem[];
};

/** Concluídos visíveis antes do `details` com o restante. */
export const VISIBLE_COMPLETED_LIMIT = 5;

const groupDescriptions: Record<RoadmapStatus, string> = {
  NOW: "Em desenvolvimento neste momento.",
  NEXT: "O que entra assim que o atual fechar.",
  FUTURE: "Direções mapeadas, sem data definida.",
  COMPLETED: "Entregue e em uso.",
};

/** Marcador do trilho: preenchido, contornado, tracejado ou check. */
function GroupMarker({ status }: { status: RoadmapStatus }) {
  const base =
    "absolute left-0 top-0.5 flex size-6 items-center justify-center rounded-full border-2 bg-background";

  if (status === "NOW") {
    return (
      <span aria-hidden="true" className={cx(base, "border-primary-strong")}>
        <span className="size-2 rounded-full bg-primary-strong" />
      </span>
    );
  }

  if (status === "NEXT") {
    return (
      <span aria-hidden="true" className={cx(base, "border-accent-strong")} />
    );
  }

  if (status === "FUTURE") {
    return (
      <span
        aria-hidden="true"
        className={cx(base, "border-dashed border-border-strong")}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cx(base, "border-success text-success")}
    >
      <CheckIcon className="size-3.5" />
    </span>
  );
}

function CompletedRow({ item }: { item: RoadmapItem }) {
  return (
    <li className="flex gap-3 py-3 opacity-75">
      <CheckIcon className="mt-1 size-4 shrink-0 text-success" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-medium text-foreground">{item.title}</p>

          {item.completedAt && (
            <time
              dateTime={item.completedAt}
              className="font-mono text-xs text-foreground-subtle"
            >
              {formatDate(item.completedAt)}
            </time>
          )}
        </div>

        <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-foreground-muted">
          {item.description}
        </p>
      </div>
    </li>
  );
}

function sortGroupItems(status: RoadmapStatus, items: RoadmapItem[]) {
  if (status === "COMPLETED") {
    return [...items].sort((a, b) => {
      if (a.completedAt && b.completedAt) {
        return b.completedAt.localeCompare(a.completedAt);
      }

      if (a.completedAt || b.completedAt) {
        return a.completedAt ? -1 : 1;
      }

      return a.order - b.order;
    });
  }

  return [...items].sort(
    (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt),
  );
}

/**
 * Um grupo do roadmap no trilho vertical. O peso visual cai de Agora para
 * Concluído: cards, cards em tom muted, linhas simples, linhas compactas.
 */
export function RoadmapGroup({ status, items }: RoadmapGroupProps) {
  const headingId = `roadmap-${status.toLowerCase()}-title`;
  const sorted = sortGroupItems(status, items);
  const meta = roadmapStatus[status];

  let body;

  if (status === "NOW" || status === "NEXT") {
    body = (
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {sorted.map((item) => (
          <Card
            key={item.id}
            as="li"
            tone={status === "NOW" ? "surface" : "muted"}
            padding="sm"
            className={cx("sm:p-5", status === "NOW" && "border-primary/40")}
          >
            <h3 className="font-semibold text-foreground">{item.title}</h3>

            <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-foreground-muted">
              {item.description}
            </p>
          </Card>
        ))}
      </ul>
    );
  } else if (status === "FUTURE") {
    body = (
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {sorted.map((item) => (
          <li key={item.id} className="py-3">
            <p className="font-medium text-foreground">{item.title}</p>

            <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-foreground-muted">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    );
  } else {
    const visible = sorted.slice(0, VISIBLE_COMPLETED_LIMIT);
    const hidden = sorted.slice(VISIBLE_COMPLETED_LIMIT);

    body = (
      <>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {visible.map((item) => (
            <CompletedRow key={item.id} item={item} />
          ))}
        </ul>

        {hidden.length > 0 && (
          <details className="group mt-3">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-sm font-mono text-xs text-foreground-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
              <ChevronRightIcon className="size-3.5 transition-transform group-open:rotate-90 motion-reduce:transition-none" />
              Ver todos os concluídos (+{hidden.length})
            </summary>

            <ul className="mt-2 divide-y divide-border border-y border-border">
              {hidden.map((item) => (
                <CompletedRow key={item.id} item={item} />
              ))}
            </ul>
          </details>
        )}
      </>
    );
  }

  return (
    <section aria-labelledby={headingId} className="relative pl-10">
      <GroupMarker status={status} />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id={headingId}
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          {meta.label}
        </h2>

        <span className="font-mono text-xs text-foreground-subtle">
          {countLabel(items.length, "item", "itens")}
        </span>
      </div>

      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        {groupDescriptions[status]}
      </p>

      {body}
    </section>
  );
}

export function RoadmapGroupSkeleton() {
  return (
    <div className="relative pl-10" aria-hidden="true">
      <Skeleton className="absolute left-0 top-0.5 size-6 rounded-full" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="mt-2 h-4 w-56" />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
