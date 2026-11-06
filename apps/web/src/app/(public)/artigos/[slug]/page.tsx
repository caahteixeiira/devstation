import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon, FolderIcon } from "@/components/ui/icons";
import { articleDate } from "@/app/features/articles/article-date";
import { formatDate } from "@/lib/dates";
import { getArticleBySlug } from "@/services/articles.service";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

/** Uma única chamada por requisição, compartilhada entre metadata e página. */
const loadArticle = cache((slug: string) => getArticleBySlug(slug));

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const date = articleDate(article);
  const projectHref = `/projetos/${encodeURIComponent(article.project.slug)}`;

  return (
    <PageIntro
      width="narrow"
      eyebrow={article.category}
      title={article.title}
      description={article.summary}
      breadcrumb={[
        { label: "Artigos", href: "/artigos" },
        { label: article.title },
      ]}
    >
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-foreground-subtle">
        <time dateTime={date}>{formatDate(date)}</time>

        <Link
          href={projectHref}
          className="inline-flex items-center gap-1.5 rounded-control border border-border bg-surface px-2.5 py-1 text-foreground-muted transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          <FolderIcon className="size-3.5" />
          Case study: {article.project.title}
        </Link>
      </div>

      <div className="mt-10 border-t border-border pt-10">
        <MarkdownContent content={article.content} />
      </div>

      <Card tone="muted" className="mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
          Projeto relacionado
        </p>

        <p className="mt-2 text-lg font-semibold text-foreground">
          Este artigo nasceu do projeto {article.project.title}
        </p>

        <p className="mt-1 text-sm leading-6 text-foreground-muted">
          Problema, solução, arquitetura e decisões técnicas no case study
          completo.
        </p>

        <ButtonLink href={projectHref} variant="secondary" className="mt-5">
          Ler o case study
          <ArrowRightIcon className="size-4" />
        </ButtonLink>
      </Card>

      <div className="mt-10 border-t border-border pt-6">
        <ButtonLink href="/artigos" variant="ghost">
          <ArrowRightIcon className="size-4 rotate-180" />
          Todos os artigos
        </ButtonLink>
      </div>
    </PageIntro>
  );
}
