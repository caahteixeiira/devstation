import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
    <section className="admin-page max-w-4xl">
      <AdminPageHeader actions={<ButtonLink href="/admin/artigos" variant="secondary">Voltar</ButtonLink>} title={<>Novo artigo</>} description={<>Escreva seu conteúdo em Markdown e vincule-o a um projeto.
        Salve como rascunho ou publique no portfólio.</>} breadcrumb={[{ label: "Administração", href: "/admin" }, { label: "Artigos", href: "/admin/artigos" }, { label: "Novo artigo" }]} />

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