"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readRoadmapFormData } from "@/lib/forms/roadmap";
import { updateRoadmapItem } from "@/services/roadmap.service";
import { updateRoadmapBodySchema } from "@/types/roadmap";
import type { CreateRoadmapActionState } from "../../novo/actions";

const roadmapIdSchema = z.number().int().positive();

export async function updateRoadmapAction(
  id: number,
  _previousState: CreateRoadmapActionState,
  formData: FormData,
): Promise<CreateRoadmapActionState> {
  await requireAdmin();

  const parsedId = roadmapIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Item de planejamento inválido.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = updateRoadmapBodySchema.safeParse(
    readRoadmapFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateRoadmapItem(parsedId.data, parsed.data, token);
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
          "Você não tem permissão para editar itens de planejamento.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O item não foi encontrado. Volte à listagem para conferir.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return {
        message: "A API rejeitou os dados. Confira os campos.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a atualização. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/roadmap");
  revalidatePath(`/admin/roadmap/${parsedId.data}/editar`);
  revalidatePath("/roadmap");

  redirect("/admin/roadmap");
}