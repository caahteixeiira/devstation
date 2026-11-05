"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readExperimentFormData } from "@/lib/forms/experiment";
import { createExperiment } from "@/services/experiments.service";
import { createExperimentBodySchema } from "@/types/experiment";

export type CreateExperimentActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createExperimentAction(
  _previousState: CreateExperimentActionState,
  formData: FormData,
): Promise<CreateExperimentActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = createExperimentBodySchema.safeParse(
    readExperimentFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createExperiment(parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar experimentos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O projeto ou uma das tecnologias selecionadas não foi encontrado. Recarregue a página para conferir.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return {
        message:
          "A API rejeitou os dados. Confira os campos e o resultado informado.",
      };
    }

    return {
      message:
        "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experimentos");
  revalidatePath("/laboratorio");
  revalidatePath("/projetos", "layout");

  redirect("/admin/experimentos");
}