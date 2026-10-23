"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { createTechnology } from "@/services/technologies.service";
import { createTechnologyBodySchema } from "@/types/technology";

export type CreateTechnologyActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createTechnologyAction(
  _previousState: CreateTechnologyActionState,
  formData: FormData,
): Promise<CreateTechnologyActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = createTechnologyBodySchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTechnology(parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar tecnologias.",
      };
    }

    if (error.kind === "HTTP" && error.status === 409) {
      return {
        message: "Já existe uma tecnologia com esse nome.",
        fieldErrors: {
          name: ["Escolha outro nome."],
        },
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return {
        message: "A API rejeitou os dados. Confira os campos.",
      };
    }

    return {
      message:
        "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/tecnologias");
  revalidatePath("/admin/projetos/novo");

  redirect("/admin/tecnologias");
}