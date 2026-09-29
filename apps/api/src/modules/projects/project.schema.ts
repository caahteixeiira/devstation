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

export const updateProjectBodySchema = z
  .object({
    title: z.string().trim().min(3).optional(),

    slug: z
      .string()
      .trim()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens.",
      )
      .optional(),

    summary: z.string().trim().min(10).optional(),
    problem: z.string().trim().min(10).optional(),
    solution: z.string().trim().min(10).optional(),
    architecture: z.string().trim().min(10).optional(),

    status: z
      .enum([
        "PLANNED",
        "IN_DEVELOPMENT",
        "COMPLETED",
        "ARCHIVED",
      ])
      .optional(),

    githubUrl: z.url().optional(),
    demoUrl: z.url().optional(),

    technologyIds: z
      .array(z.number().int().positive())
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided.",
  );

export type UpdateProjectBody = z.infer<
  typeof updateProjectBodySchema
>;