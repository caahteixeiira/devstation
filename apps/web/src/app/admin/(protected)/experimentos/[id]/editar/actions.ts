"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readExperimentFormData } from "@/lib/forms/experiment";
import { updateExperiment } from "@/services/experiments.service";
import { createExperimentBodySchema } from "@/types/experiment";
import type { CreateExperimentActionState } from "../../novo/actions";

const experimentIdSchema = z.number().int().positive();

export async function updateExperimentAction(
  id: number,
  _previousState: CreateExperimentActionState,
  formData: FormData,
): Promise<CreateExperimentActionState> {
  await requireAdmin();

  const parsedId = experimentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Experimento inválido.",
    };
  }

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
    await updateExperiment(parsedId.data, parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para editar experimentos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O experimento, o projeto ou uma das tecnologias selecionadas não foi encontrado. Recarregue a página para conferir.",
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
        "Não foi possível confirmar a atualização. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experimentos");
  revalidatePath(`/admin/experimentos/${parsedId.data}/editar`);
  revalidatePath("/laboratorio");
  revalidatePath("/projetos", "layout");

  redirect("/admin/experimentos");
}