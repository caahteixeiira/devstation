import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { getArticleBySlugForAdmin } from "@/services/articles.service";
import type { AdminArticleDetail } from "@/types/article";
import { deleteArticleAction } from "./actions";
import { DeleteArticleForm } from "./DeleteArticleForm";

export const metadata: Metadata = {
  title: "Excluir artigo",
};

type DeleteArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DeleteArticlePage({
  params,
}: DeleteArticlePageProps) {
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

  const action = deleteArticleAction.bind(null, article.slug);

  return (
    <section className="max-w-2xl">
      <Link
        href="/admin/artigos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos artigos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Excluir artigo
      </h1>

      <p className="mt-4 text-foreground-muted">
        Você está prestes a excluir o artigo{" "}
        <strong className="text-foreground">
          {article.title}
        </strong>.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Efeito da exclusão
        </h2>

        <p className="mt-3 leading-7 text-foreground-muted">
          O artigo e seu conteúdo serão removidos definitivamente.
          Ele também deixará de aparecer entre os artigos
          relacionados ao projeto.
        </p>

        <p className="mt-3 leading-7 text-foreground-muted">
          O projeto {article.project.title} será mantido.
          Para retirar o artigo da área pública preservando
          seu conteúdo, você pode arquivá-lo pela edição.
        </p>
      </div>

      <DeleteArticleForm
        slug={article.slug}
        action={action}
      />
    </section>
  );
}