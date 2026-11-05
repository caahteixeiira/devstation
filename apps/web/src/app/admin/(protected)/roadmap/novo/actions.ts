"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readRoadmapFormData } from "@/lib/forms/roadmap";
import { createRoadmapItem } from "@/services/roadmap.service";
import { createRoadmapBodySchema } from "@/types/roadmap";

export type CreateRoadmapActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createRoadmapAction(
  _previousState: CreateRoadmapActionState,
  formData: FormData,
): Promise<CreateRoadmapActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = createRoadmapBodySchema.safeParse(
    readRoadmapFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createRoadmapItem(parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar itens de planejamento.",
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

  revalidatePath("/admin/roadmap");
  revalidatePath("/roadmap");

  redirect("/admin/roadmap");
}