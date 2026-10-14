import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { getArticleBySlug } from "@/services/articles.service";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <article className="mx-auto w-full min-w-0 max-w-3xl">
        <Link href="/artigos" className="text-primary-strong hover:underline">
          ← Voltar aos artigos
        </Link>

        <p className="mt-8 font-mono text-sm uppercase tracking-widest text-primary-strong">
          {article.category}
        </p>

        <Link
          href={`/projetos/${encodeURIComponent(article.project.slug)}`}
          className="mt-2 inline-block text-sm text-foreground-muted hover:text-primary-strong"
        >
          Projeto: {article.project.title}
        </Link>

        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          {article.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-foreground-muted">
          {article.summary}
        </p>

        <div className="mt-12">
          <MarkdownContent content={article.content} />
        </div>
      </article>
    </main>
  );
}
