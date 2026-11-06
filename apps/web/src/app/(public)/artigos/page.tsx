import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArticleListItem,
  ArticleListItemSkeleton,
} from "@/app/features/articles/ArticleListItem";
import {
  articleYear,
  sortArticlesByDate,
} from "@/app/features/articles/article-date";
import { articlesPageIntro } from "@/app/features/articles/intro";
import { countLabel } from "@/lib/text";
import { listArticles } from "@/services/articles.service";

export const metadata: Metadata = {
  title: articlesPageIntro.title,
  description: articlesPageIntro.description,
};

/** Conteúdo dependente da API, em Suspense interno (sem loading.tsx de rota). */
async function ArticlesContent() {
  await connection();
  const articles = sortArticlesByDate(await listArticles());

  // Só apresentação: o mais recente abre a página; o resto vira lista.
  const [lead, ...rest] = articles;
  const multipleYears = new Set(articles.map(articleYear)).size > 1;

  return (
    <PageIntro
      {...articlesPageIntro}
      meta={
        articles.length > 0 ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {countLabel(articles.length, "artigo")}
          </span>
        ) : undefined
      }
    >
      {articles.length === 0 || !lead ? (
        <EmptyState
          className="mt-12"
          icon={<BookIcon />}
          title="Nenhum artigo disponível ainda."
          description="Os artigos aparecem aqui assim que forem publicados."
        />
      ) : (
        <>
          <div className="mt-12">
            <ArticleListItem article={lead} variant="lead" />
          </div>

          {rest.length > 0 && (
            <section aria-labelledby="all-articles-title" className="mt-16">
              <SectionHeader
                id="all-articles-title"
                eyebrow="Arquivo"
                title="Todos os artigos"
              />

              <div className="mt-6 border-b border-border">
                {rest.map((article, index) => {
                  const year = articleYear(article);
                  const previous = rest[index - 1];
                  const showYear =
                    multipleYears &&
                    (!previous || articleYear(previous) !== year);

                  return (
                    <ArticleListItem
                      key={article.id}
                      article={article}
                      variant="row"
                      yearLabel={showYear ? year : undefined}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </PageIntro>
  );
}

function ArticlesSkeleton() {
  return (
    <PageIntro {...articlesPageIntro}>
      <p role="status" className="sr-only">
        Carregando artigos…
      </p>

      <div className="mt-12">
        <ArticleListItemSkeleton variant="lead" />
      </div>

      <div className="mt-16">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-8 w-56" />

        <div className="mt-6 border-b border-border">
          <ArticleListItemSkeleton variant="row" />
          <ArticleListItemSkeleton variant="row" />
          <ArticleListItemSkeleton variant="row" />
        </div>
      </div>
    </PageIntro>
  );
}

export default function ArtigosPage() {
  return (
    <Suspense fallback={<ArticlesSkeleton />}>
      <ArticlesContent />
    </Suspense>
  );
}
