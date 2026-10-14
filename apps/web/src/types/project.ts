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

export type ProjectSummary = z.infer<typeof projectSummarySchema>;
