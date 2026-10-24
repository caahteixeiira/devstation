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
    <section>
      <Link
        href="/admin"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar à administração
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Artigos
      </h1>

      <p className="mt-4 text-foreground-muted">
        Artigos publicados, rascunhos e conteúdos arquivados.
      </p>

      <Link
  href="/admin/artigos/novo"
  className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
>
  Novo artigo
</Link>

      {articles.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum artigo cadastrado.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
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
                    {statusLabels[article.status]}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/artigos/${encodeURIComponent(article.slug)}/editar`}
                      aria-label={`Editar artigo ${article.title}`}
                      className="mr-4 inline-block text-primary-strong hover:underline"
                    >
                      Editar
                    </Link>

                    <Link
  href={`/admin/artigos/${encodeURIComponent(article.slug)}/excluir`}
  aria-label={`Excluir artigo ${article.title}`}
  className="mr-4 inline-block text-primary-strong hover:underline"
>
  Excluir
</Link>

                    {article.status === "PUBLISHED" ? (
                      <Link
                        href={`/artigos/${encodeURIComponent(article.slug)}`}
                        aria-label={`Ver artigo ${article.title}`}
                        className="text-primary-strong hover:underline"
                      >
                        Ver no portfólio →
                      </Link>
                    ) : (
                      <span className="text-foreground-muted">
                        Indisponível na área pública
                      </span>
                    )}
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