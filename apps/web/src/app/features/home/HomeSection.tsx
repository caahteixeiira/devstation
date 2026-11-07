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
 * blocos; `inverted` usa a faixa de contato, com tokens próprios para manter
 * o convite escuro e legível nos dois temas.
 */
const toneStyles: Record<HomeSectionTone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  inverted: "contact-band",
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
      <div className="public-container public-gutter home-section-content px-6 py-16">
        {children}
      </div>
    </section>
  );
}
