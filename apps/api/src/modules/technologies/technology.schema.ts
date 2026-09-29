import { z } from "zod";

export const createTechnologyBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(100),
});

export const updateTechnologyBodySchema =
  createTechnologyBodySchema.partial().refine(
  (data) => data.name !== undefined || data.category !== undefined,
  {
    message: "At least one field must be provided.",
  },
  );

export const technologyIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateTechnologyBody = z.infer<
  typeof createTechnologyBodySchema
>;

export type UpdateTechnologyBody = z.infer<
  typeof updateTechnologyBodySchema
>;

export type TechnologyIdParams = z.infer<
  typeof technologyIdParamsSchema
>;