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

export type ProjectSlugParams = z.infer<typeof projectSlugParamsSchema>;

const projectFeatureSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
});

const projectImageSchema = z.object({
  imageUrl: z.url(),
  altText: z.string().trim().min(2),
});

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
  status: z.enum(["PLANNED", "IN_DEVELOPMENT", "COMPLETED", "ARCHIVED"]),
  githubUrl: z.url().optional(),
  demoUrl: z.url().optional(),
  technologyIds: z.array(z.number().int().positive()).default([]),
  features: z.array(projectFeatureSchema).optional(),
  improvements: z.array(z.string().trim().min(2)).optional(),
  images: z.array(projectImageSchema).optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;

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
      .enum(["PLANNED", "IN_DEVELOPMENT", "COMPLETED", "ARCHIVED"])
      .optional(),

    githubUrl: z.url().optional(),
    demoUrl: z.url().optional(),

    technologyIds: z.array(z.number().int().positive()).optional(),
    features: z.array(projectFeatureSchema).optional(),
    improvements: z.array(z.string().trim().min(2)).optional(),
    images: z.array(projectImageSchema).optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided.",
  );

export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
