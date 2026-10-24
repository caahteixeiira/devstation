"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readArticleFormData } from "@/lib/forms/article";
import { updateArticle } from "@/services/articles.service";
import { updateArticleBodySchema } from "@/types/article";
import type { CreateArticleActionState } from "../../novo/actions";

const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function updateArticleAction(
  originalSlug: string,
  _previousState: CreateArticleActionState,
  formData: FormData,
): Promise<CreateArticleActionState> {
  await requireAdmin();

  const parsedSlug = slugSchema.safeParse(originalSlug);

  if (!parsedSlug.success) {
    return {
      message: "Artigo inválido.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const parsed = updateArticleBodySchema.safeParse(
    readArticleFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let savedSlug: string;

  try {
    const article = await updateArticle(
      parsedSlug.data,
      parsed.data,
      token,
    );

    savedSlug = article.slug;
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.kind === "HTTP" && error.status === 401) {
      redirect("/admin/login");
    }

    if (error.kind === "HTTP" && error.status === 403) {
      return {
        message: "Você não tem permissão para editar artigos.",
      };
    }

    if (error.kind === "HTTP" && error.status === 404) {
      return {
        message:
          "O artigo ou o projeto selecionado não foi encontrado. Recarregue a página para conferir.",
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
        "Não foi possível confirmar a atualização. Confira a listagem antes de tentar novamente.",
    };
  }

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/projetos", "layout");

  revalidatePath(
    `/artigos/${encodeURIComponent(parsedSlug.data)}`,
  );

  revalidatePath(
    `/artigos/${encodeURIComponent(savedSlug)}`,
  );

  revalidatePath(
    `/admin/artigos/${encodeURIComponent(parsedSlug.data)}/editar`,
  );

  redirect("/admin/artigos");
}