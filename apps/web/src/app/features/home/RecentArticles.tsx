import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  articleDate,
  sortArticlesByDate,
} from "@/app/features/articles/article-date";
import { formatDate } from "@/lib/dates";
import { getHomeArticles } from "./home-data";
import { HomeSection } from "./HomeSection";

/** Some por inteiro, faixa incluída, quando não há artigos ou a API falha. */
export async function RecentArticles() {
  const articles = await getHomeArticles();

  if (!articles.ok || articles.data.length === 0) {
    return null;
  }

  const recent = sortArticlesByDate(articles.data).slice(0, 3);

  return (
    <HomeSection labelledBy="recent-articles-title">
      <SectionHeader
        id="recent-articles-title"
        eyebrow="Leitura"
        title="Artigos recentes"
        action={
          <ButtonLink href="/artigos" variant="ghost" size="sm">
            Todos os artigos
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        }
      />

      <ol className="mt-6 divide-y divide-border border-y border-border">
        {recent.map((article) => {
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
    </HomeSection>
  );
}
