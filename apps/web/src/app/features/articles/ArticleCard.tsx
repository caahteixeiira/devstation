import type { Article } from "./articles";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-primary-strong">
          {article.category}
        </span>

        <span className="text-foreground-muted">
          Projeto: {article.project}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-foreground">
        {article.title}
      </h2>

      <p className="mt-3 text-foreground-muted">
        {article.summary}
      </p>
    </article>
  );
}