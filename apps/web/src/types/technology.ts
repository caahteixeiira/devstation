import { z } from "zod";

export const technologySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  category: z.string(),
});

export const technologiesResponseSchema = z.object({
  data: z.array(technologySchema),
});

export type Technology = z.infer<typeof technologySchema>;

export const createTechnologyBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(100),
});

export const technologyResponseSchema = z.object({
  data: technologySchema,
});

export type CreateTechnologyBody = z.infer<
  typeof createTechnologyBodySchema
>;

export const updateTechnologyBodySchema =
  createTechnologyBodySchema.partial().refine(
    (data) =>
      data.name !== undefined || data.category !== undefined,
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  );

export type UpdateTechnologyBody = z.infer<
  typeof updateTechnologyBodySchema
>;