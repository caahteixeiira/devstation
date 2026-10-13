import { z } from "zod";

export const createExperimentBodySchema = z.object({
  projectId: z.number().int().positive().nullable().optional(),
  title: z.string().trim().min(2),
  objective: z.string().trim().min(10),
  result: z.string().trim().min(10).nullable().optional(),
  status: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
  technologyIds: z.array(z.number().int().positive()).optional(),
});

export const updateExperimentBodySchema = createExperimentBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const experimentIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateExperimentBody = z.infer<typeof createExperimentBodySchema>;

export type UpdateExperimentBody = z.infer<typeof updateExperimentBodySchema>;

export type ExperimentIdParams = z.infer<typeof experimentIdParamsSchema>;
