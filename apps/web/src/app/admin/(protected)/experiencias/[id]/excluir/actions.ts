"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteExperience } from "@/services/experiences.service";

export type DeleteExperienceActionState = {
  message: string;
};

const experienceIdSchema = z.number().int().positive();

export async function deleteExperienceAction(
  id: number,
  _previousState: DeleteExperienceActionState,
  formData: FormData,
): Promise<DeleteExperienceActionState> {
  await requireAdmin();

  const parsedId = experienceIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Experiência inválida.",
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
    await deleteExperience(parsedId.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para excluir experiências.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "A experiência não foi encontrada. Volte à listagem para conferir.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experiencias");
  revalidatePath(`/admin/experiencias/${parsedId.data}/editar`);
  revalidatePath("/sobre");

  redirect("/admin/experiencias");
}