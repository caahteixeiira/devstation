import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type HomeSectionTone = "default" | "surface" | "inverted";

type HomeSectionProps = {
  labelledBy: string;
  tone?: HomeSectionTone;
  className?: string;
  children: ReactNode;
};

/**
 * Faixa de largura total da Home. A alternância de tons dá ritmo entre os
 * blocos; `inverted` troca fundo e texto no tema claro e, no escuro, usa a
 * superfície secundária para manter contraste sem um bloco escuro sobre
 * fundo escuro.
 */
const toneStyles: Record<HomeSectionTone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  inverted:
    "bg-foreground text-background dark:bg-surface-muted dark:text-foreground",
};

export function HomeSection({
  labelledBy,
  tone = "default",
  className,
  children,
}: HomeSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cx(
        "border-b border-border last:border-b-0",
        toneStyles[tone],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        {children}
      </div>
    </section>
  );
}
