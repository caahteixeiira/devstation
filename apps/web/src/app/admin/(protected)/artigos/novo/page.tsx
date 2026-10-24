import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjects } from "@/services/projects.service";
import { CreateArticleForm } from "./CreateArticleForm";

export const metadata: Metadata = {
  title: "Novo artigo",
};

export default async function NewArticlePage() {
  await requireAdmin();

  const projects = await listProjects();

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/artigos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos artigos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Novo artigo
      </h1>

      <p className="mt-4 text-foreground-muted">
        Escreva seu conteúdo em Markdown e vincule-o a um projeto.
        Salve como rascunho ou publique no portfólio.
      </p>

      {projects.length === 0 && (
        <Link
          href="/admin/projetos/novo"
          className="mt-6 inline-block text-primary-strong hover:underline"
        >
          Cadastrar um projeto →
        </Link>
      )}

      <CreateArticleForm projects={projects} />
    </section>
  );
}