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
