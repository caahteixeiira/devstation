import { z } from "zod";

export const createDecisionBodySchema = z.object({
  title: z.string().trim().min(2),
  context: z.string().trim().min(10),
  decision: z.string().trim().min(10),
  consequences: z.string().trim().min(10),
});

export const updateDecisionBodySchema = createDecisionBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const decisionProjectParamsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const decisionIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateDecisionBody = z.infer<typeof createDecisionBodySchema>;

export type UpdateDecisionBody = z.infer<typeof updateDecisionBodySchema>;

export type DecisionProjectParams = z.infer<typeof decisionProjectParamsSchema>;

export type DecisionIdParams = z.infer<typeof decisionIdParamsSchema>;
