import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      tone="muted"
      className={cx(
        "flex flex-col items-center border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted">
          {icon}
        </div>
      )}

      <p className={cx("font-medium text-foreground", icon ? "mt-4" : undefined)}>
        {title}
      </p>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-foreground-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
