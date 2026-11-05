"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import {
  listProjectDecisions,
  updateDecision,
} from "@/services/decisions.service";
import { getProjectBySlug } from "@/services/projects.service";
import { createDecisionBodySchema } from "@/types/decision";
import type { CreateDecisionActionState } from "../../novo/actions";

const decisionIdSchema = z.number().int().positive();

export async function updateDecisionAction(
  slug: string,
  id: number,
  _previousState: CreateDecisionActionState,
  formData: FormData,
): Promise<CreateDecisionActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsedId = decisionIdSchema.safeParse(id);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !parsedId.success) {
    return { message: "Projeto ou decisão inválida." };
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

  const decisions = await listProjectDecisions(project.id);

  if (!decisions.some((item) => item.id === parsedId.data)) {
    return { message: "Decisão técnica não encontrada neste projeto." };
  }

  try {
    await updateDecision(parsedId.data, parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para editar decisões técnicas.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message: "A decisão não foi encontrada. Volte à lista para conferir.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return { message: "A API rejeitou os dados. Confira os campos." };
    }

    return {
      message:
        "Não foi possível confirmar a atualização. Confira a lista antes de tentar novamente.",
    };
  }

  const projectSlug = encodeURIComponent(project.slug);
  const decisionsPath = `/admin/projetos/${projectSlug}/decisoes`;

  revalidatePath(decisionsPath);
  revalidatePath(`${decisionsPath}/${parsedId.data}/editar`);
  revalidatePath(`/projetos/${projectSlug}`);

  redirect(decisionsPath);
}
