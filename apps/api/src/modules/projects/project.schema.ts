import { z } from "zod";

export const projectSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens.",
    ),
});

export type ProjectSlugParams = z.infer<
  typeof projectSlugParamsSchema
>;