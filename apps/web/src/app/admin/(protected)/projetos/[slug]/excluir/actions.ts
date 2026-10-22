"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteProject } from "@/services/projects.service";

export type DeleteProjectActionState = {
  message: string;
};

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function deleteProjectAction(
  slug: string,
  _previousState: DeleteProjectActionState,
  formData: FormData,
): Promise<DeleteProjectActionState> {
  await requireAdmin();

  const parsedSlug = slugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    return {
      message: "O endereço do projeto é inválido.",
    };
  }

  const confirmation = formData.get("confirmation");

  if (confirmation !== parsedSlug.data) {
    return {
      message: "Digite o slug do projeto exatamente como indicado.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  try {
    await deleteProject(parsedSlug.data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.kind === "HTTP" && error.status === 401) {
        redirect("/admin/login");
      }

      if (error.kind === "HTTP" && error.status === 403) {
        return {
          message: "Você não tem permissão para excluir projetos.",
        };
      }

      if (error.kind === "HTTP" && error.status === 404) {
        return {
          message:
            "O projeto não foi encontrado. Volte à listagem para conferir.",
        };
      }

      return {
        message:
          "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
      };
    }

    throw error;
  }

  revalidatePath("/admin/projetos");
  revalidatePath("/projetos");
  revalidatePath("/artigos");
  revalidatePath("/laboratorio");

  revalidatePath(`/projetos/${encodeURIComponent(parsedSlug.data)}`);

  revalidatePath(
    `/admin/projetos/${encodeURIComponent(parsedSlug.data)}/editar`,
  );

  redirect("/admin/projetos");
}
