import { z } from "zod";
import { technologySchema } from "./technology";

export const certificationSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(), issuer: z.string(),
  issueDate: z.iso.datetime(), expirationDate: z.iso.datetime().nullable(),
  credentialId: z.string().nullable(), credentialUrl: z.url({ protocol: /^https$/ }).nullable(),
  imagePath: z.string().nullable(), imageUrl: z.url({ protocol: /^https?$/ }).nullable(),
  imageAlt: z.string(), featured: z.boolean(), order: z.number().int(),
  deleting: z.boolean(), technologies: z.array(technologySchema),
}).transform((value) => ({ ...value, skills: value.technologies.map((technology) => technology.name) }));
export const certificationsResponseSchema = z.object({ data: z.array(certificationSchema) });
export const certificationResponseSchema = z.object({ data: certificationSchema });
export type Certification = z.infer<typeof certificationSchema>;

export const certificationBodySchema = z.object({
  title: z.string().trim().min(2).max(200), issuer: z.string().trim().min(2).max(200),
  issueDate: z.iso.date(), expirationDate: z.iso.date().nullable(),
  credentialId: z.string().trim().min(1).max(200).nullable(),
  credentialUrl: z.url({ protocol: /^https$/ }).max(2000).nullable(),
  imageAlt: z.string().trim().max(500), featured: z.boolean(),
  order: z.number().int().min(0).max(10000),
  technologyIds: z.array(z.number().int().positive()).max(50),
}).refine((value) => !value.expirationDate || value.expirationDate >= value.issueDate, {
  path: ["expirationDate"], message: "A validade deve ser posterior ou igual à emissão.",
});
export type CertificationBody = z.infer<typeof certificationBodySchema>;
