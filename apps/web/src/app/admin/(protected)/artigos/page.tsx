import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { listArticlesForAdmin } from "@/services/articles.service";
import type { AdminArticleSummary } from "@/types/article";

export const metadata: Metadata = {
  title: "Gerenciar artigos",
};

const statusLabels: Record<AdminArticleSummary["status"], string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

export default async function AdminArticlesPage() {
  await requireAdmin();

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  let articles: AdminArticleSummary[];

  try {
    articles = await listArticlesForAdmin(token);
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

  return (
    <section className="admin-page">
      <AdminPageHeader title={<>Artigos</>} description={<>Artigos publicados, rascunhos e conteúdos arquivados.</>} actions={<ButtonLink
        href="/admin/artigos/novo"
      >
        Novo artigo
      </ButtonLink>} />

      {articles.length === 0 ? (
        <EmptyState title="Nenhum artigo cadastrado." description="Use a ação de criação acima para adicionar o primeiro registro." />
      ) : (
        <div className="admin-table-wrap border border-border" role="region" aria-label="Artigos — tabela" tabIndex={0}>
          <table className="admin-table w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Artigo
                </th>

                <th scope="col" className="px-4 py-3">
                  Projeto
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>

                <th scope="col" className="px-4 py-3">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t border-border"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium"
                  >
                    <span className="block">
                      {article.title}
                    </span>

                    <span className="mt-1 block font-normal text-foreground-muted">
                      {article.category}
                    </span>
                  </th>

                  <td className="px-4 py-4 text-foreground-muted">
                    {article.project.title}
                  </td>

                  <td className="px-4 py-4">
                    <Badge dot tone={article.status === "PUBLISHED" ? "success" : article.status === "DRAFT" ? "accent" : "neutral"}>{statusLabels[article.status]}</Badge>
                  </td>

                  <td className="px-4 py-4">
                    <div className="admin-article-actions inline-flex items-center gap-5">
                      <Link
                        href={`/admin/artigos/${encodeURIComponent(article.slug)}/editar`}
                        aria-label={`Editar artigo ${article.title}`}
                        className="text-primary-strong hover:underline"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/admin/artigos/${encodeURIComponent(article.slug)}/excluir`}
                        aria-label={`Excluir artigo ${article.title}`}
                        className="text-primary-strong hover:underline"
                      >
                        Excluir
                      </Link>

                      {article.status === "PUBLISHED" && (
                        <Link
                          href={`/artigos/${encodeURIComponent(article.slug)}`}
                          aria-label={`Ver artigo ${article.title}`}
                          className="text-primary-strong hover:underline"
                        >
                          Ver no portfólio →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
