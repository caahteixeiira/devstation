import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers and hyphens.",
  );

export const createArticleBodySchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(2),
  slug: slugSchema,
  summary: z.string().trim().min(2),
  content: z.string().trim().min(2),
  category: z.string().trim().min(2),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const articleSlugParamsSchema = z.object({
  slug: slugSchema,
});

export const updateArticleBodySchema =
  createArticleBodySchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    },
  );



export type CreateArticleBody = z.infer< 
typeof createArticleBodySchema
>;

export type ArticleSlugParams = z.infer<
  typeof articleSlugParamsSchema
>;

export type UpdateArticleBody = z.infer<
  typeof updateArticleBodySchema
>;