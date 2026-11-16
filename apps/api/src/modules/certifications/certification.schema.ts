import { z } from "zod";

export const certificationIdSchema = z.object({ id: z.coerce.number().int().positive().max(2_147_483_647) });
const date = z.iso.date().transform((value) => new Date(`${value}T00:00:00.000Z`));
export const createCertificationSchema = z.object({
  title: z.string().trim().min(2).max(200),
  issuer: z.string().trim().min(2).max(200),
  issueDate: date,
  expirationDate: date.nullable().optional(),
  credentialId: z.string().trim().min(1).max(200).nullable().optional(),
  credentialUrl: z.url({ protocol: /^https$/ }).max(2000).nullable().optional(),
  imageAlt: z.string().trim().max(500).default(""),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(10000).default(0),
  technologyIds: z.array(z.number().int().positive()).max(50).default([]),
}).strict();
export const updateCertificationSchema = createCertificationSchema.partial().refine(
  (value) => Object.keys(value).length > 0, "Provide at least one field.",
);
export type CreateCertification = z.infer<typeof createCertificationSchema>;
export type UpdateCertification = z.infer<typeof updateCertificationSchema>;
