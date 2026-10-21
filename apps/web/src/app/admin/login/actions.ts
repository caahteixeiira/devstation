"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createSession } from "@/lib/auth/session";
import { login } from "@/services/auth.service";
import { loginBodySchema } from "@/types/auth";

export type LoginActionState = {
  message: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginBodySchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      message: "Informe um e-mail válido e uma senha sem espaços.",
    };
  }

  try {
    const result = await login(parsed.data);

    await createSession(result.token, result.expiresIn);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.kind === "HTTP" && error.status === 401) {
        return {
          message: "E-mail ou senha inválidos.",
        };
      }

      return {
        message:
          "Não foi possível entrar agora. Tente novamente em instantes.",
      };
    }

    throw error;
  }

  redirect("/admin");
}