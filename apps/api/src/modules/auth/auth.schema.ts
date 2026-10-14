import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z
    .string()
    .min(1)
    .max(128)
    .regex(/^\S+$/, "Password must not contain whitespace."),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
