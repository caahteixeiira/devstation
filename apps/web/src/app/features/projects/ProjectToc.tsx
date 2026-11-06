import { ChevronRightIcon } from "@/components/ui/icons";

export type TocItem = {
  id: string;
  label: string;
};

type ProjectTocProps = {
  items: TocItem[];
  /** "desktop": nav fixa na coluna lateral. "mobile": details nativo. */
  variant: "desktop" | "mobile";
};

const linkStyles =
  "group flex items-baseline gap-3 rounded-sm py-1 text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="space-y-1">
      {items.map((item, index) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={linkStyles}>
            <span className="font-mono text-[11px] text-foreground-subtle transition-colors group-hover:text-primary-strong">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Índice do case study, só com âncoras: Server Component, sem estado.
 * Recebe apenas as seções realmente presentes na página.
 */
export function ProjectToc({ items, variant }: ProjectTocProps) {
  if (items.length === 0) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <details className="group rounded-card border border-border bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-card px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong [&::-webkit-details-marker]:hidden">
          Nesta página
          <ChevronRightIcon className="size-4 transition-transform group-open:rotate-90 motion-reduce:transition-none" />
        </summary>

        <div className="border-t border-border px-4 py-3">
          <TocList items={items} />
        </div>
      </details>
    );
  }

  return (
    <nav aria-label="Nesta página">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
        Nesta página
      </p>

      <div className="mt-3">
        <TocList items={items} />
      </div>
    </nav>
  );
}
