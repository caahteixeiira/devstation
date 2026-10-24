import { z } from "zod";

const articleProjectSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
});

export const articleSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  category: z.string(),
  status: z.literal("PUBLISHED"),
  publishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  project: articleProjectSchema,
});

export const articlesResponseSchema = z.object({
  data: z.array(articleSummarySchema),
});

export const articleDetailSchema = articleSummarySchema.extend({
  content: z.string(),
});

export const articleDetailResponseSchema = z.object({
  data: articleDetailSchema,
});

export type ArticleSummary = z.infer<typeof articleSummarySchema>;

export type ArticleDetail = z.infer<typeof articleDetailSchema>;


export const adminArticleSummarySchema = articleSummarySchema.extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  updatedAt: z.iso.datetime(),
});

export const adminArticlesResponseSchema = z.object({
  data: z.array(adminArticleSummarySchema),
});

export const adminArticleDetailSchema = adminArticleSummarySchema.extend({
  content: z.string(),
});

export const adminArticleDetailResponseSchema = z.object({
  data: adminArticleDetailSchema,
});

export type AdminArticleSummary = z.infer<
  typeof adminArticleSummarySchema
>;

export type AdminArticleDetail = z.infer<
  typeof adminArticleDetailSchema
>;

export const createArticleBodySchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use letras minúsculas, números e hífens.",
    ),
  summary: z.string().trim().min(2),
  content: z.string().trim().min(2),
  category: z.string().trim().min(2),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const createArticleResponseSchema = z.object({
  data: z.object({
    id: z.number().int().positive(),
    projectId: z.number().int().positive(),
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    content: z.string(),
    category: z.string(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

export type CreateArticleBody = z.infer<
  typeof createArticleBodySchema
>;

export type CreatedArticle = z.infer<
  typeof createArticleResponseSchema
>["data"];

export const updateArticleBodySchema = createArticleBodySchema
  .extend({
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  })
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  );

export const updateArticleResponseSchema = z.object({
  data: createArticleResponseSchema.shape.data.extend({
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  }),
});

export type UpdateArticleBody = z.infer<
  typeof updateArticleBodySchema
>;

export type UpdatedArticle = z.infer<
  typeof updateArticleResponseSchema
>["data"];