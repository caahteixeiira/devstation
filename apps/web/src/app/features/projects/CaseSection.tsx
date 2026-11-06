import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cx } from "@/lib/cx";

type CaseSectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Seção do case study: alvo de âncora do índice, com margem de rolagem
 * para o título não ficar escondido sob o topo.
 */
export function CaseSection({
  id,
  title,
  eyebrow,
  description,
  className,
  children,
}: CaseSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx("scroll-mt-24", className)}
    >
      <SectionHeader
        id={`${id}-title`}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="mt-5">{children}</div>
    </section>
  );
}
