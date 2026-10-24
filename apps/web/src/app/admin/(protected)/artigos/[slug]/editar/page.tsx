import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { getArticleBySlugForAdmin } from "@/services/articles.service";
import { listProjects } from "@/services/projects.service";
import type { AdminArticleDetail } from "@/types/article";
import { ArticleForm } from "../../novo/CreateArticleForm";
import { updateArticleAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar artigo",
};

type EditArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  await requireAdmin();

  const { slug } = await params;

  if (
    slug.length < 2 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    notFound();
  }

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  let article: AdminArticleDetail | null;

  try {
    article = await getArticleBySlugForAdmin(slug, token);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.kind === "HTTP" &&
      error.status === 401
    ) {
      redirect("/admin/login");
    }

    throw error;
  }

  if (!article) {
    notFound();
  }

  const projects = await listProjects();
  const action = updateArticleAction.bind(null, article.slug);

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/artigos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos artigos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Editar artigo
      </h1>

      <p className="mt-4 text-foreground-muted">
        Atualize o conteúdo, o projeto vinculado e o status
        de publicação.
      </p>

      <ArticleForm
        key={article.id}
        projects={projects}
        initialArticle={article}
        action={action}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando…"
      />
    </section>
  );
}