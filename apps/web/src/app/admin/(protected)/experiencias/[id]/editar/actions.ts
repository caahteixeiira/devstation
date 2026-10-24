"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readExperienceFormData } from "@/lib/forms/experience";
import { updateExperience } from "@/services/experiences.service";
import { createExperienceBodySchema } from "@/types/experience";
import type { CreateExperienceActionState } from "../../novo/actions";

const experienceIdSchema = z.number().int().positive();

export async function updateExperienceAction(
  id: number,
  _previousState: CreateExperienceActionState,
  formData: FormData,
): Promise<CreateExperienceActionState> {
  await requireAdmin();

  const parsedId = experienceIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Experiência inválida.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const form = readExperienceFormData(formData);

  if (!form.success) {
    return {
      message: form.message,
    };
  }

  const parsed = createExperienceBodySchema.safeParse(form.data);

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateExperience(parsedId.data, parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para editar experiências.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "A experiência ou uma das tecnologias selecionadas não foi encontrada. Recarregue a página para conferir.",
      };
    }

    if (error.kind === "HTTP" && error.status === 400) {
      return {
        message:
          "A API rejeitou os dados. Confira os campos e o período informado.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a atualização. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/experiencias");
  revalidatePath(`/admin/experiencias/${parsedId.data}/editar`);
  revalidatePath("/sobre");

  redirect("/admin/experiencias");
}