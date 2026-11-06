import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  articleDate,
  sortArticlesByDate,
} from "@/app/features/articles/article-date";
import { formatDate } from "@/lib/dates";
import { getEngineeringArticles } from "./engineering-data";

const LIMIT = 3;

/** Artigos ligados ao projeto DevStation. Some sem dados. */
export async function EngineeringArticles() {
  const slug = siteConfig.engineeringProjectSlug;
  const articles = await getEngineeringArticles();

  if (!slug || !articles.ok) {
    return null;
  }

  const related = sortArticlesByDate(
    articles.data.filter((article) => article.project.slug === slug),
  ).slice(0, LIMIT);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="eng-articles-title">
      <SectionHeader
        id="eng-articles-title"
        eyebrow="Leitura"
        title="Artigos sobre o DevStation"
        description="Decisões e aprendizados registrados durante a construção da plataforma."
        action={
          <ButtonLink href="/artigos" variant="ghost" size="sm">
            Todos os artigos
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />

      <ol className="mt-4 divide-y divide-border border-y border-border">
        {related.map((article) => {
          const date = articleDate(article);

          return (
            <li key={article.id}>
              <Link
                href={`/artigos/${encodeURIComponent(article.slug)}`}
                className="group grid gap-1 rounded-sm py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-xs text-primary-strong">
                  {article.category}
                </span>

                <span className="font-medium text-foreground transition-colors group-hover:text-primary-strong motion-reduce:transition-none">
                  {article.title}
                </span>

                <time
                  dateTime={date}
                  className="font-mono text-xs text-foreground-subtle"
                >
                  {formatDate(date)}
                </time>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
