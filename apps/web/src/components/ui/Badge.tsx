import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning";

type BadgeProps = {
  tone?: BadgeTone;
  dot?: boolean;
  mono?: boolean;
  className?: string;
  children: ReactNode;
};

const toneStyles: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-muted text-foreground-muted",
  primary: "border-primary/30 bg-primary/10 text-primary-strong",
  accent: "border-accent/30 bg-accent/10 text-accent-strong",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

const dotStyles: Record<BadgeTone, string> = {
  neutral: "bg-foreground-subtle",
  primary: "bg-primary-strong",
  accent: "bg-accent-strong",
  success: "bg-success",
  warning: "bg-warning",
};

export function Badge({
  tone = "neutral",
  dot = false,
  mono = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        mono && "font-mono",
        toneStyles[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cx("size-1.5 shrink-0 rounded-full", dotStyles[tone])}
        />
      )}
      {children}
    </span>
  );
}
