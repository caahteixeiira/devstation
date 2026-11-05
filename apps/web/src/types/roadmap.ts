import { z } from "zod";

export const roadmapItemSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["NOW", "NEXT", "FUTURE", "COMPLETED"]),
  order: z.number().int(),
  completedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const roadmapResponseSchema = z.object({
  data: z.array(roadmapItemSchema),
});

export type RoadmapItem = z.infer<typeof roadmapItemSchema>;


export const createRoadmapBodySchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  status: z.enum(["NOW", "NEXT", "FUTURE", "COMPLETED"]),
  order: z.number().int().nonnegative(),
});

export const roadmapItemResponseSchema = z.object({
  data: roadmapItemSchema,
});

export type CreateRoadmapBody = z.infer<
  typeof createRoadmapBodySchema
>;

export const updateRoadmapBodySchema = createRoadmapBodySchema
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    },
  );

export type UpdateRoadmapBody = z.infer<
  typeof updateRoadmapBodySchema
>;