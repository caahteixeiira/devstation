import type { ArticleSummary } from "@/types/article";

/** Data de referência do artigo: publicação, ou criação quando não há publicação. */
export function articleDate(article: ArticleSummary): string {
  return article.publishedAt ?? article.createdAt;
}

export function articleYear(article: ArticleSummary): string {
  return articleDate(article).slice(0, 4);
}

/** Mais recente primeiro. */
export function sortArticlesByDate(articles: ArticleSummary[]): ArticleSummary[] {
  return [...articles].sort((a, b) =>
    articleDate(b).localeCompare(articleDate(a)),
  );
}
