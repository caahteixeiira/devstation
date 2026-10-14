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
