"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { readProjectFormData } from "@/lib/forms/project";
import { updateProject } from "@/services/projects.service";
import { updateProjectBodySchema } from "@/types/project";
import type { CreateProjectActionState } from "../../novo/actions";

const originalSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function updateProjectAction(
  originalSlug: string,
  _previousState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> {
  await requireAdmin();

  const parsedSlug = originalSlugSchema.safeParse(originalSlug);

  if (!parsedSlug.success) {
    return {
      message: "O endereço do projeto é inválido.",
    };
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const form = readProjectFormData(formData);

  if (!form.success) {
    return {
      message: form.message,
    };
  }

  const parsed = updateProjectBodySchema.safeParse(form.data);

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let savedSlug: string;

  try {
    const project = await updateProject(parsedSlug.data, parsed.data, token);

    savedSlug = project.slug;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.kind === "HTTP" && error.status === 401) {
        redirect("/admin/login");
      }

      if (error.kind === "HTTP" && error.status === 403) {
        return {
          message: "Você não tem permissão para editar projetos.",
        };
      }

      if (error.kind === "HTTP" && error.status === 404) {
        return {
          message: "O projeto não foi encontrado. Volte à listagem.",
        };
      }

      if (error.kind === "HTTP" && error.status === 409) {
        return {
          message: "Já existe um projeto com esse slug.",
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

    throw error;
  }

  revalidatePath("/admin/projetos");
  revalidatePath("/projetos");

  revalidatePath(`/projetos/${encodeURIComponent(parsedSlug.data)}`);

  revalidatePath(`/projetos/${encodeURIComponent(savedSlug)}`);

  revalidatePath(
    `/admin/projetos/${encodeURIComponent(parsedSlug.data)}/editar`,
  );

  redirect("/admin/projetos");
}
