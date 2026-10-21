import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .max(128)
    .regex(/^\S+$/, "A senha não deve conter espaços."),
});

export const authUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
  role: z.literal("ADMIN"),
});

export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string().min(1),
    tokenType: z.literal("Bearer"),
    expiresIn: z.number().int().positive(),
    user: authUserSchema,
  }),
});

export const authMeResponseSchema = z.object({
  data: authUserSchema,
});

export type LoginBody = z.infer<typeof loginBodySchema>;
export type AuthUser = z.infer<typeof authUserSchema>;