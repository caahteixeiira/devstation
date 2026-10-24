"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { createExperience } from "@/services/experiences.service";
import { createExperienceBodySchema } from "@/types/experience";
import { readExperienceFormData } from "@/lib/forms/experience";

export type CreateExperienceActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};


export async function createExperienceAction(
  _previousState: CreateExperienceActionState,
  formData: FormData,
): Promise<CreateExperienceActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const form = readExperienceFormData(formData);

  if (!form.success) {
    return {
      message: form.message,
    };
  }

  const parsed = createExperienceBodySchema.safeParse(form.data);

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createExperience(parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar experiências.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "Uma das tecnologias selecionadas não foi encontrada. Recarregue a página e confira a seleção.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return {
        message:
          "A API rejeitou os dados. Confira os campos e o período informado.",
      };
    }

    return {
      message:
        "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experiencias");
  revalidatePath("/sobre");

  redirect("/admin/experiencias");
}