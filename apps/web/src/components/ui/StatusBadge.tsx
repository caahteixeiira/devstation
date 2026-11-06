import { Badge } from "./Badge";
import { getStatusMeta, type StatusRef } from "./status";

type StatusBadgeProps = StatusRef & { className?: string };

export function StatusBadge({ className, ...ref }: StatusBadgeProps) {
  const meta = getStatusMeta(ref);

  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  );
}
