"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import {
  deleteDecision,
  listProjectDecisions,
} from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";

export type DeleteDecisionActionState = {
  message: string;
};

export async function deleteDecisionAction(
  slug: string,
  id: number,
  _previousState: DeleteDecisionActionState,
  formData: FormData,
): Promise<DeleteDecisionActionState> {
  await requireAdmin();

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    return { message: "Projeto ou decisão inválida." };
  }

  if (formData.get("confirmation") !== "EXCLUIR") {
    return { message: "Digite EXCLUIR para confirmar." };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    return { message: "Projeto não encontrado. Volte à lista de projetos." };
  }

  const decisions = await listProjectDecisions(project.id);

  if (!decisions.some((item) => item.id === id)) {
    return { message: "Decisão técnica não encontrada neste projeto." };
  }

  try {
    await deleteDecision(id, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para excluir decisões técnicas.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message: "A decisão não foi encontrada. Volte à lista para conferir.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a lista antes de tentar novamente.",
    };
  }

  const projectSlug = encodeURIComponent(project.slug);
  const decisionsPath = `/admin/projetos/${projectSlug}/decisoes`;

  revalidatePath(decisionsPath);
  revalidatePath(`${decisionsPath}/${id}/editar`);
  revalidatePath(`/projetos/${projectSlug}`);

  redirect(decisionsPath);
}
