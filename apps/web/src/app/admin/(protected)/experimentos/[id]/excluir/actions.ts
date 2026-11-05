"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteExperiment } from "@/services/experiments.service";

export type DeleteExperimentActionState = {
  message: string;
};

const experimentIdSchema = z.number().int().positive();

export async function deleteExperimentAction(
  id: number,
  _previousState: DeleteExperimentActionState,
  formData: FormData,
): Promise<DeleteExperimentActionState> {
  await requireAdmin();

  const parsedId = experimentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Experimento inválido.",
    };
  }

  if (formData.get("confirmation") !== "EXCLUIR") {
    return {
      message: "Digite EXCLUIR para confirmar.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  try {
    await deleteExperiment(parsedId.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para excluir experimentos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O experimento não foi encontrado. Volte à listagem para conferir.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experimentos");
  revalidatePath(`/admin/experimentos/${parsedId.data}/editar`);
  revalidatePath("/laboratorio");
  revalidatePath("/projetos", "layout");

  redirect("/admin/experimentos");
}