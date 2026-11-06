import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";
import type { Decision } from "@/types/decision";

type DecisionItemProps = {
  decision: Decision;
  /** Posição na lista ordenada por createdAt. Só apresentação: vira "ADR-001". */
  index: number;
};

const blocks: Array<{ label: string; field: keyof Decision }> = [
  { label: "Contexto", field: "context" },
  { label: "Decisão", field: "decision" },
  { label: "Consequências", field: "consequences" },
];

export function DecisionItem({ decision, index }: DecisionItemProps) {
  const code = `ADR-${String(index).padStart(3, "0")}`;
  const headingId = `adr-${decision.id}-title`;

  return (
    <Card as="article" padding="none" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3 sm:px-6">
        <Badge tone="primary" mono>
          {code}
        </Badge>

        <time
          dateTime={decision.createdAt}
          className="font-mono text-xs text-foreground-subtle"
        >
          {formatDate(decision.createdAt)}
        </time>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <h3
          id={headingId}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {decision.title}
        </h3>

        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
          {blocks.map((block) => (
            <div key={block.field} className="contents">
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong sm:pt-1.5">
                {block.label}
              </dt>

              <dd className="whitespace-pre-line leading-7 text-foreground-muted">
                {String(decision[block.field])}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
