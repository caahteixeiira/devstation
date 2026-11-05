"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteRoadmapItem } from "@/services/roadmap.service";

export type DeleteRoadmapActionState = {
  message: string;
};

const roadmapIdSchema = z.number().int().positive();

export async function deleteRoadmapAction(
  id: number,
  _previousState: DeleteRoadmapActionState,
  formData: FormData,
): Promise<DeleteRoadmapActionState> {
  await requireAdmin();

  const parsedId = roadmapIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Item de planejamento inválido.",
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
    await deleteRoadmapItem(parsedId.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message:
          "Você não tem permissão para excluir itens de planejamento.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O item não foi encontrado. Volte à listagem para conferir.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/roadmap");
  revalidatePath(`/admin/roadmap/${parsedId.data}/editar`);
  revalidatePath("/roadmap");

  redirect("/admin/roadmap");
}