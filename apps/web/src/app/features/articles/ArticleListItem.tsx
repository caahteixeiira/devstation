import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FolderIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { cx } from "@/lib/cx";
import { formatDate } from "@/lib/dates";
import type { ArticleSummary } from "@/types/article";
import { articleDate } from "./article-date";

type ArticleListItemProps = {
  article: ArticleSummary;
  /** "lead": bloco de abertura do mais recente. "row": linha da lista. */
  variant: "lead" | "row";
  /** Rótulo de ano exibido na linha, quando a lista cobre mais de um ano. */
  yearLabel?: string;
};

/**
 * Link estendido: o título cobre o item inteiro via ::after; o link do
 * projeto é âncora irmã com z-index acima. Nenhuma âncora aninhada.
 */
const stretchedLinkStyles =
  "after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary-strong focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-background";

const projectLinkStyles =
  "relative z-10 inline-flex items-center gap-1.5 rounded-sm font-mono text-xs text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

function ProjectLink({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/projetos/${encodeURIComponent(article.project.slug)}`}
      className={projectLinkStyles}
      aria-label={`Case study ${article.project.title}`}
    >
      <FolderIcon className="size-3.5" />
      {article.project.title}
    </Link>
  );
}

export function ArticleListItem({
  article,
  variant,
  yearLabel,
}: ArticleListItemProps) {
  const date = articleDate(article);
  const href = `/artigos/${encodeURIComponent(article.slug)}`;

  if (variant === "lead") {
    return (
      <Card as="article" padding="lg" className="group relative">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="primary">{article.category}</Badge>

          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
            Mais recente
          </span>
        </div>

        <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          <Link
            href={href}
            className={cx(
              "transition-colors group-hover:text-primary-strong motion-reduce:transition-none",
              stretchedLinkStyles,
            )}
          >
            {article.title}
          </Link>
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-foreground-muted">
          {article.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <time
            dateTime={date}
            className="font-mono text-xs text-foreground-subtle"
          >
            {formatDate(date)}
          </time>

          <ProjectLink article={article} />
        </div>
      </Card>
    );
  }

  return (
    <article className="group relative grid gap-2 border-t border-border py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
      <div className="flex items-center gap-3 sm:block">
        {yearLabel && (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong sm:mb-1">
            {yearLabel}
          </p>
        )}

        <time
          dateTime={date}
          className="font-mono text-xs text-foreground-subtle"
        >
          {formatDate(date)}
        </time>
      </div>

      <div className="min-w-0">
        <p className="font-mono text-xs text-primary-strong">
          {article.category}
        </p>

        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          <Link
            href={href}
            className={cx(
              "transition-colors group-hover:text-primary-strong motion-reduce:transition-none",
              stretchedLinkStyles,
            )}
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-foreground-muted">
          {article.summary}
        </p>

        <div className="mt-3">
          <ProjectLink article={article} />
        </div>
      </div>
    </article>
  );
}

export function ArticleListItemSkeleton({
  variant,
}: {
  variant: "lead" | "row";
}) {
  if (variant === "lead") {
    return (
      <Card padding="lg" className="space-y-4" aria-hidden="true">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-48" />
      </Card>
    );
  }

  return (
    <div
      className="grid gap-2 border-t border-border py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-20" />

      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
