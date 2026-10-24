"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { updateTechnology } from "@/services/technologies.service";
import { updateTechnologyBodySchema } from "@/types/technology";
import type { CreateTechnologyActionState } from "../../novo/actions";

const technologyIdSchema = z.number().int().positive();

export async function updateTechnologyAction(
  id: number,
  _previousState: CreateTechnologyActionState,
  formData: FormData,
): Promise<CreateTechnologyActionState> {
  await requireAdmin();

  const parsedId = technologyIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      message: "Tecnologia inválida.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = updateTechnologyBodySchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTechnology(parsedId.data, parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para editar tecnologias.",
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
        message: "Já existe uma tecnologia com esse nome.",
        fieldErrors: {
          name: ["Escolha outro nome."],
        },
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

  revalidatePath("/admin/tecnologias");
  revalidatePath(`/admin/tecnologias/${parsedId.data}/editar`);
  revalidatePath("/admin/projetos/novo");

  redirect("/admin/tecnologias");
}