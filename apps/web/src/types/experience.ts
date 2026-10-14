import { z } from "zod";

const experienceItemSchema = z.object({
  id: z.number().int().positive(),
  description: z.string(),
  order: z.number().int(),
});

const experienceTechnologySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  category: z.string(),
});

export const experienceSchema = z.object({
  id: z.number().int().positive(),
  company: z.string(),
  role: z.string(),
  description: z.string(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().nullable(),
  current: z.boolean(),
  responsibilities: z.array(experienceItemSchema),
  achievements: z.array(experienceItemSchema),
  technologies: z.array(experienceTechnologySchema),
});

export const experiencesResponseSchema = z.object({
  data: z.array(experienceSchema),
});

export type Experience = z.infer<typeof experienceSchema>;
