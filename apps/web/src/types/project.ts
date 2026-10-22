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

const optionalProjectUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.url().optional(),
);

export const createProjectBodySchema = z.object({
  title: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use letras minúsculas, números e hífens.",
    ),
  summary: z.string().trim().min(10),
  problem: z.string().trim().min(10),
  solution: z.string().trim().min(10),
  architecture: z.string().trim().min(10),
  status: projectSummarySchema.shape.status,
  githubUrl: optionalProjectUrlSchema,
  demoUrl: optionalProjectUrlSchema,
  technologyIds: z.array(z.number().int().positive()).default([]),
  features: z
    .array(
      z.object({
        title: z.string().trim().min(2),
        description: z.string().trim().min(10),
      }),
    )
    .optional(),
  improvements: z.array(z.string().trim().min(2)).optional(),
  images: z
    .array(
      z.object({
        imageUrl: projectImageSourceSchema,
        altText: z.string().trim().min(2),
      }),
    )
    .optional(),
});

export const createProjectResponseSchema = z.object({
  data: projectSummarySchema,
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;

const updateProjectUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.url().nullable().optional(),
);

export const updateProjectBodySchema = createProjectBodySchema
  .omit({ technologyIds: true })
  .partial()
  .extend({
    technologyIds: z.array(z.number().int().positive()).optional(),
    githubUrl: updateProjectUrlSchema,
    demoUrl: updateProjectUrlSchema,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Informe pelo menos um campo para atualizar.",
  });

export const updateProjectResponseSchema = z.object({
  data: projectSummarySchema,
});

export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
