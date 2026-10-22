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