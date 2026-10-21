import { z } from "zod";

const experimentProjectSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
});

const experimentTechnologySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  category: z.string(),
});

export const experimentSchema = z.object({
  id: z.number().int().positive(),
  projectId: z.number().int().positive().nullable(),
  title: z.string(),
  objective: z.string(),
  result: z.string().nullable(),
  status: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  project: experimentProjectSchema.nullable(),
  technologies: z.array(experimentTechnologySchema),
});

export const experimentsResponseSchema = z.object({
  data: z.array(experimentSchema),
});

export type Experiment = z.infer<typeof experimentSchema>;
