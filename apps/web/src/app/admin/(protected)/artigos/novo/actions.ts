"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { createArticle } from "@/services/articles.service";
import { createArticleBodySchema } from "@/types/article";
import { readArticleFormData } from "@/lib/forms/article";

export type CreateArticleActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createArticleAction(
  _previousState: CreateArticleActionState,
  formData: FormData,
): Promise<CreateArticleActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = createArticleBodySchema.safeParse(
    readArticleFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createArticle(parsed.data, token);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para cadastrar artigos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message: "O projeto selecionado não foi encontrado.",
        fieldErrors: {
          projectId: ["Recarregue a página e selecione um projeto válido."],
        },
      };
    }

    if (error.kind === "HTTP" && error.status === 409) {
      return {
        message: "Já existe um artigo com esse slug.",
        fieldErrors: {
          slug: ["Escolha outro slug."],
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
        "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/projetos", "layout");

  redirect("/admin/artigos");
}