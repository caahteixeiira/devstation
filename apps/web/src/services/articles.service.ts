import "server-only";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiError,
} from "@/lib/api/client";
import {
  articlesResponseSchema,
  articleDetailResponseSchema,
  adminArticlesResponseSchema,
adminArticleDetailResponseSchema,
createArticleResponseSchema,
updateArticleResponseSchema,
type UpdateArticleBody,
type UpdatedArticle,
type CreateArticleBody,
type CreatedArticle,
type AdminArticleSummary,
type AdminArticleDetail,
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


export async function listArticlesForAdmin(
  token: string,
): Promise<AdminArticleSummary[]> {
  const response = await apiGet<unknown>(
    "/admin/articles",
    { token },
  );

  const parsed = adminArticlesResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid admin articles response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function getArticleBySlugForAdmin(
  slug: string,
  token: string,
): Promise<AdminArticleDetail | null> {
  let response: unknown;

  try {
    response = await apiGet<unknown>(
      `/admin/articles/${encodeURIComponent(slug)}`,
      { token },
    );
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

  const parsed = adminArticleDetailResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid admin article detail response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function createArticle(
  data: CreateArticleBody,
  token: string,
): Promise<CreatedArticle> {
  const response = await apiPost<unknown>(
    "/articles",
    data,
    { token },
  );

  const parsed = createArticleResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid article creation response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}
export async function updateArticle(
  slug: string,
  data: UpdateArticleBody,
  token: string,
): Promise<UpdatedArticle> {
  const response = await apiPatch<unknown>(
    `/articles/${encodeURIComponent(slug)}`,
    data,
    { token },
  );

  const parsed = updateArticleResponseSchema.safeParse(response);

  if (!parsed.success) {
    throw new ApiError(
      "API returned an invalid article update response.",
      "INVALID_RESPONSE",
    );
  }

  return parsed.data.data;
}

export async function deleteArticle(
  slug: string,
  token: string,
): Promise<void> {
  await apiDelete(
    `/articles/${encodeURIComponent(slug)}`,
    { token },
  );
}