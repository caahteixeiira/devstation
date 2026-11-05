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

export const createExperimentBodySchema = z
  .object({
    projectId: z.number().int().positive().nullable().optional(),
    title: z.string().trim().min(2),
    objective: z.string().trim().min(10),
    result: z.string().trim().min(10).nullable().optional(),
    status: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
    technologyIds: z.array(z.number().int().positive()).optional(),
  })
  .superRefine((data, context) => {
    if (data.status === "COMPLETED" && !data.result?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["result"],
        message: "Informe o resultado para concluir o experimento.",
      });
    }
  });

export const experimentResponseSchema = z.object({
  data: experimentSchema,
});

export type CreateExperimentBody = z.infer<
  typeof createExperimentBodySchema
>;

export const updateExperimentBodySchema = z
  .object({
    ...createExperimentBodySchema.shape,
  })
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  );

export type UpdateExperimentBody = z.infer<
  typeof updateExperimentBodySchema
>;