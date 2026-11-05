import { z } from "zod";

export const decisionSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  consequences: z.string(),
  createdAt: z.iso.datetime(),
});

export const decisionsResponseSchema = z.object({
  data: z.array(decisionSchema),
});

export type Decision = z.infer<typeof decisionSchema>;

export const decisionResponseSchema = z.object({
  data: decisionSchema,
});

export const createDecisionBodySchema = z.object({
  title: z.string().trim().min(2, "Informe pelo menos 2 caracteres."),
  context: z.string().trim().min(10, "Informe pelo menos 10 caracteres."),
  decision: z.string().trim().min(10, "Informe pelo menos 10 caracteres."),
  consequences: z.string().trim().min(10, "Informe pelo menos 10 caracteres."),
});

export type CreateDecisionBody = z.infer<typeof createDecisionBodySchema>;

export const updateDecisionBodySchema = createDecisionBodySchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Informe pelo menos um campo para atualizar.",
  });

export type UpdateDecisionBody = z.infer<typeof updateDecisionBodySchema>;
