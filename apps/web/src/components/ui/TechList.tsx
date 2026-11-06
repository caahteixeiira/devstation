import { cx } from "@/lib/cx";

type Technology = { id: number; name: string };

type TechListProps = {
  technologies: Technology[];
  label?: string;
  /** Limita os chips exibidos e mostra "+N" com o restante. */
  max?: number;
  className?: string;
};

const chipStyles =
  "rounded-control border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground-muted";

export function TechList({
  technologies,
  label = "Tecnologias utilizadas",
  max,
  className,
}: TechListProps) {
  if (technologies.length === 0) {
    return null;
  }

  const visible =
    max !== undefined ? technologies.slice(0, max) : technologies;
  const hidden = technologies.length - visible.length;

  return (
    <ul aria-label={label} className={cx("flex flex-wrap gap-2", className)}>
      {visible.map((technology) => (
        <li key={technology.id} className={chipStyles}>
          {technology.name}
        </li>
      ))}

      {hidden > 0 && (
        <li
          className={cx(chipStyles, "text-foreground-subtle")}
          aria-label={`e mais ${hidden}`}
        >
          +{hidden}
        </li>
      )}
    </ul>
  );
}
