import { z } from "zod";

export const projectSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens.",
    ),
});

export type ProjectSlugParams = z.infer<
  typeof projectSlugParamsSchema
>;

export const createProjectBodySchema = z.object({
  title: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens.",
    ),
  summary: z.string().trim().min(10),
  problem: z.string().trim().min(10),
  solution: z.string().trim().min(10),
  architecture: z.string().trim().min(10),
  status: z.enum([
    "PLANNED",
    "IN_DEVELOPMENT",
    "COMPLETED",
    "ARCHIVED",
  ]),
  githubUrl: z.url().optional(),
  demoUrl: z.url().optional(),
  technologyIds: z.array(z.number().int().positive()).default([]),
});

export type CreateProjectBody = z.infer<
  typeof createProjectBodySchema
>;