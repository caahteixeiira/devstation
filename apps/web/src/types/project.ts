import { z } from "zod";

const projectTechnologySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  category: z.string(),
});

export const projectSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  status: z.enum(["PLANNED", "IN_DEVELOPMENT", "COMPLETED", "ARCHIVED"]),
  githubUrl: z.url().nullable(),
  demoUrl: z.url().nullable(),
  technologies: z.array(projectTechnologySchema),
});

export const projectsResponseSchema = z.object({
  data: z.array(projectSummarySchema),
});

const projectImageSourceSchema = z.union([
  z
    .string()
    .regex(
      /^\/images\/projects\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|avif)$/,
      "Invalid local project image path.",
    ),
  z.url({ protocol: /^https?$/ }),
]);

export type ProjectSummary = z.infer<typeof projectSummarySchema>;

const projectFeatureSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
});

const projectImprovementSchema = z.object({
  id: z.number().int().positive(),
  description: z.string(),
  order: z.number().int(),
});

const projectImageSchema = z.object({
  id: z.number().int().positive(),
  imageUrl: projectImageSourceSchema,
  altText: z.string(),
  order: z.number().int(),
});

const projectDecisionSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  consequences: z.string(),
  createdAt: z.iso.datetime(),
});

const projectArticleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  category: z.string(),
  status: z.literal("PUBLISHED"),
  publishedAt: z.iso.datetime().nullable(),
});

const projectExperimentSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  objective: z.string(),
  result: z.string().nullable(),
  status: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
  technologies: z.array(projectTechnologySchema),
});

export const projectDetailSchema = projectSummarySchema.extend({
  problem: z.string(),
  solution: z.string(),
  architecture: z.string(),
  features: z.array(projectFeatureSchema),
  improvements: z.array(projectImprovementSchema),
  images: z.array(projectImageSchema),
  decisions: z.array(projectDecisionSchema),
  articles: z.array(projectArticleSchema),
  experiments: z.array(projectExperimentSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const projectDetailResponseSchema = z.object({
  data: projectDetailSchema,
});

export type ProjectDetail = z.infer<typeof projectDetailSchema>;
