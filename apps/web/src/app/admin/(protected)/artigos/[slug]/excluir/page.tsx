import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Metadata } from "next";

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
    <section className="admin-page max-w-4xl admin-delete-page">
      <AdminPageHeader actions={<ButtonLink href="/admin/artigos" variant="secondary">Cancelar exclusão</ButtonLink>} title={<>Excluir artigo</>} description={<>Você está prestes a excluir o artigo{" "}
        <strong className="text-foreground">
          {article.title}
        </strong>.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Artigos", href: "/admin/artigos" }, { label: "Excluir artigo" }]} />

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