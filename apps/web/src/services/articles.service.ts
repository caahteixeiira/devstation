import "server-only";
import { apiGet, ApiError } from "@/lib/api/client";
import {
  articlesResponseSchema,
  articleDetailResponseSchema,
  type ArticleSummary,
  type ArticleDetail,
} from "@/types/article";

export async function listArticles(): Promise<ArticleSummary[]> {
  const response = await apiGet<unknown>("/articles");

  const parsed = articlesResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid articles response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  let response: unknown;

  try {
    response = await apiGet<unknown>(`/articles/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.kind === "HTTP" &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }

  const parsed = articleDetailResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid article detail response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
