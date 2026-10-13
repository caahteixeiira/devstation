import { z } from "zod";

export const createExperienceBodySchema = z.object({
  company: z.string().trim().min(2, "Company must have at least 2 characters."),
  role: z.string().trim().min(2, "Role must have at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must have at least 10 characters."),
  current: z.boolean().default(false),
  startDate: z.iso.date(),
  endDate: z.iso.date().nullable().optional(),
  responsibilities: z.array(z.string().trim().min(2)).optional(),
  achievements: z.array(z.string().trim().min(2)).optional(),
  technologyIds: z.array(z.number().int().positive()).optional(),
});

export const updateExperienceBodySchema = createExperienceBodySchema
  .partial()
  .extend({
    current: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const experienceIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateExperienceBody = z.infer<typeof createExperienceBodySchema>;

export type UpdateExperienceBody = z.infer<typeof updateExperienceBodySchema>;

export type ExperienceIdParams = z.infer<typeof experienceIdParamsSchema>;
