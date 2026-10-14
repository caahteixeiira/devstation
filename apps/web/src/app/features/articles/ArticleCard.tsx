import Link from "next/link";
import type { ArticleSummary } from "@/types/article";

type ArticleCardProps = {
  article: ArticleSummary;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/artigos/${encodeURIComponent(article.slug)}`}
      className="group block rounded-2xl border border-border bg-surface p-6 transition hover:border-primary-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-strong"
    >
      <article>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-primary-strong">{article.category}</span>

          <span className="text-foreground-muted">
            Projeto: {article.project.title}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-foreground group-hover:text-primary-strong">
          {article.title}
        </h2>

        <p className="mt-3 text-foreground-muted">{article.summary}</p>
      </article>
    </Link>
  );
}
