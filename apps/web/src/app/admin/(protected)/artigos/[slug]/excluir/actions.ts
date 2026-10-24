"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { deleteArticle } from "@/services/articles.service";

export type DeleteArticleActionState = {
  message: string;
};

const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function deleteArticleAction(
  slug: string,
  _previousState: DeleteArticleActionState,
  formData: FormData,
): Promise<DeleteArticleActionState> {
  await requireAdmin();

  const parsedSlug = slugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    return {
      message: "Artigo inválido.",
    };
  }

  if (formData.get("confirmation") !== parsedSlug.data) {
    return {
      message: "Digite o slug do artigo exatamente como indicado.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  try {
    await deleteArticle(parsedSlug.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para excluir artigos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O artigo não foi encontrado. Volte à listagem para conferir.",
      };
    }

    return {
      message:
        "Não foi possível confirmar a exclusão. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/projetos", "layout");

  revalidatePath(
    `/artigos/${encodeURIComponent(parsedSlug.data)}`,
  );

  revalidatePath(
    `/admin/artigos/${encodeURIComponent(parsedSlug.data)}/editar`,
  );

  redirect("/admin/artigos");
}