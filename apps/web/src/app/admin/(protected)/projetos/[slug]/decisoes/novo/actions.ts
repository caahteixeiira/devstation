"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { createProjectDecision } from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";
import { createDecisionBodySchema } from "@/types/decision";

export type CreateDecisionActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createDecisionAction(
  slug: string,
  _previousState: CreateDecisionActionState,
  formData: FormData,
): Promise<CreateDecisionActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { message: "Projeto inválido." };
  }

  const parsed = createDecisionBodySchema.safeParse({
    title: formData.get("title"),
    context: formData.get("context"),
    decision: formData.get("decision"),
    consequences: formData.get("consequences"),
  });

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    return { message: "Projeto não encontrado. Volte à lista de projetos." };
  }

  try {
    await createProjectDecision(project.id, parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar decisões técnicas.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message: "Projeto não encontrado. Volte à lista de projetos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return { message: "A API rejeitou os dados. Confira os campos." };
    }

    return {
      message:
        "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
    };
  }

  const projectSlug = encodeURIComponent(project.slug);
  const decisionsPath = `/admin/projetos/${projectSlug}/decisoes`;

  revalidatePath(decisionsPath);
  revalidatePath(`/projetos/${projectSlug}`);

  redirect(decisionsPath);
}
