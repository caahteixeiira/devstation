"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { createProject } from "@/services/projects.service";
import { createProjectBodySchema } from "@/types/project";

export type CreateProjectActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createProjectAction(
  _previousState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const featureTitles = formData.getAll("featureTitles");
const featureDescriptions = formData.getAll("featureDescriptions");

if (featureTitles.length !== featureDescriptions.length) {
  return {
    message: "Confira as funcionalidades informadas.",
  };
}

const features = featureTitles.map((title, index) => ({
  title,
  description: featureDescriptions[index],
}));

const improvementsText = formData.get("improvements");

if (typeof improvementsText !== "string") {
  return {
    message: "Confira as melhorias informadas.",
  };
}

const improvements = improvementsText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

  const imageUrls = formData.getAll("imageUrls");
const imageAltTexts = formData.getAll("imageAltTexts");

if (imageUrls.length !== imageAltTexts.length) {
  return {
    message: "Confira as imagens informadas.",
  };
}

const images = imageUrls.map((imageUrl, index) => ({
  imageUrl,
  altText: imageAltTexts[index],
}));

  const parsed = createProjectBodySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    architecture: formData.get("architecture"),
    status: formData.get("status"),
    githubUrl: formData.get("githubUrl"),
    demoUrl: formData.get("demoUrl"),
    features,
    improvements,
    images,
  });

  if (!parsed.success) {
    return {
      message: "Confira os campos informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createProject(parsed.data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.kind === "HTTP" && error.status === 401) {
        redirect("/admin/login");
      }

      if (error.kind === "HTTP" && error.status === 403) {
        return {
          message: "Você não tem permissão para cadastrar projetos.",
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
          "Não foi possível confirmar o cadastro. Confira a listagem antes de tentar novamente.",
      };
    }

    throw error;
  }

  revalidatePath("/admin/projetos");
  revalidatePath("/projetos");

  redirect("/admin/projetos");
}