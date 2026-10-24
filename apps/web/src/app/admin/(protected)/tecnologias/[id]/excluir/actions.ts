"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteTechnology } from "@/services/technologies.service";

export type DeleteTechnologyActionState = {
  message: string;
};

const technologyIdSchema = z.number().int().positive();

export async function deleteTechnologyAction(
  id: number,
  _previousState: DeleteTechnologyActionState,
  formData: FormData,
): Promise<DeleteTechnologyActionState> {
  await requireAdmin();

  const parsedId = technologyIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Tecnologia inválida.",
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
    await deleteTechnology(parsedId.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para excluir tecnologias.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "A tecnologia não foi encontrada. Volte à listagem para conferir.",
      };
    }

    if (error.kind === "HTTP" && error.status === 409) {
      return {
        message:
          "A tecnologia não pode ser excluída porque possui vínculos que impedem a operação.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/tecnologias");
  revalidatePath(`/admin/tecnologias/${parsedId.data}/editar`);
  revalidatePath("/admin/projetos", "layout");
  revalidatePath("/projetos", "layout");
  revalidatePath("/sobre");
  revalidatePath("/laboratorio");

  redirect("/admin/tecnologias");
}