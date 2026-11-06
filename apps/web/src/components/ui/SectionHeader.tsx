import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type HeadingLevel = "h1" | "h2" | "h3";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  as?: HeadingLevel;
  tone?: "primary" | "accent";
  id?: string;
  className?: string;
};

const headingStyles: Record<HeadingLevel, string> = {
  h1: "text-3xl sm:text-4xl",
  h2: "text-2xl",
  h3: "text-lg",
};

export function SectionHeader({
  title,
  eyebrow,
  description,
  action,
  as: Heading = "h2",
  tone = "primary",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-between gap-4", className)}
    >
      <div className="min-w-0 max-w-3xl">
        {eyebrow && (
          <p
            className={cx(
              "font-mono text-xs uppercase tracking-[0.2em]",
              tone === "accent" ? "text-accent-strong" : "text-primary-strong",
            )}
          >
            {eyebrow}
          </p>
        )}

        <Heading
          id={id}
          className={cx(
            "font-semibold tracking-tight text-foreground",
            headingStyles[Heading],
            eyebrow && "mt-2",
          )}
        >
          {title}
        </Heading>

        {description && (
          <p className="mt-3 leading-7 text-foreground-muted">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
