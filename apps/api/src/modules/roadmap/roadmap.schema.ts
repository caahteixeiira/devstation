import { z } from "zod";

export const createRoadmapBodySchema = z.object({
  title: z.string().trim().min(2, "Title must have at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must have at least 10 characters."),
  status: z.enum(["NOW", "NEXT", "FUTURE", "COMPLETED"]),
  order: z.number().int().nonnegative(),
});

export const updateRoadmapBodySchema = createRoadmapBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const roadmapIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateRoadmapBody = z.infer<typeof createRoadmapBodySchema>;
export type UpdateRoadmapBody = z.infer<typeof updateRoadmapBodySchema>;
export type RoadmapIdParams = z.infer<typeof roadmapIdParamsSchema>;
