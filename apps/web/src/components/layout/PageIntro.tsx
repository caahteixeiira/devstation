import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { cx } from "@/lib/cx";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "primary" | "accent";
  breadcrumb?: BreadcrumbItem[];
  meta?: ReactNode;
  actions?: ReactNode;
  width?: "default" | "narrow";
  children?: ReactNode;
};

/**
 * Cabeçalho padrão das páginas públicas. O landmark <main> é renderizado
 * pelo layout público, por isso este componente usa <div> e <section>.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  accent = "primary",
  breadcrumb,
  meta,
  actions,
  width = "default",
  children,
}: PageIntroProps) {
  const eyebrowColor =
    accent === "accent" ? "text-accent-strong" : "text-primary-strong";

  return (
    <div className="flex flex-1 px-6 py-12 lg:px-10 lg:py-16">
      <section
        className={cx(
          "mx-auto w-full",
          width === "narrow" ? "max-w-3xl" : "max-w-7xl",
        )}
      >
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-6" />}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <p
              className={`font-mono text-xs uppercase tracking-[0.2em] ${eyebrowColor}`}
            >
              {eyebrow}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>

              {meta}
            </div>

            <p className="mt-4 text-lg leading-8 text-foreground-muted">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
          )}
        </div>

        {children}
      </section>
    </div>
  );
}
