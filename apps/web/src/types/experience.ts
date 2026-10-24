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

export const createExperienceBodySchema = z
  .object({
    company: z.string().trim().min(2),
    role: z.string().trim().min(2),
    description: z.string().trim().min(10),
    current: z.boolean().default(false),
    startDate: z.iso.date(),
    endDate: z.iso.date().nullable().optional(),
    responsibilities: z.array(z.string().trim().min(2)).optional(),
    achievements: z.array(z.string().trim().min(2)).optional(),
    technologyIds: z.array(z.number().int().positive()).optional(),
  })
  .superRefine((data, context) => {
    const endDate = data.endDate ?? null;

    if (data.current && endDate !== null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Uma experiência atual não pode ter data de término.",
      });
    }

    if (!data.current && endDate === null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Informe a data de término.",
      });
    }

    if (endDate !== null && endDate < data.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "O término não pode ser anterior ao início.",
      });
    }
  });

export const experienceResponseSchema = z.object({
  data: experienceSchema,
});

export type CreateExperienceBody = z.infer<
  typeof createExperienceBodySchema
>;

export const updateExperienceBodySchema = z
  .object({
    ...createExperienceBodySchema.shape,
    current: z.boolean(),
  })
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  );

export type UpdateExperienceBody = z.infer<
  typeof updateExperienceBodySchema
>;